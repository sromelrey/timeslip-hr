import { DataSource, Between } from 'typeorm';
import { Seeder } from './seed.config';
import { TimeEvent } from '../../entities/time-event.entity';
import { Employee } from '../../entities/employee.entity';
import { TimeEventType, TimeEventSource } from '../../types/enums';
import { randomUUID } from 'crypto';

export const TimeEventSeeder: Seeder = {
  name: 'TimeEventSeeder',

  async run(dataSource: DataSource): Promise<void> {
    const timeEventRepo = dataSource.getRepository(TimeEvent);
    const employeeRepo = dataSource.getRepository(Employee);

    // Get active employees
    const employees = await employeeRepo.find({ where: { isActive: true } });
    if (employees.length === 0) {
      console.log('  ❌ No employees found. Run EmployeeSeeder first.');
      return;
    }

    // Generate events for the last 15 days to ensure we have data
    const now = new Date();
    const daysToGenerate = 15;
    
    let totalCreated = 0;

    for (const employee of employees) {
      console.log(`  Creating time events for ${employee.firstName} ${employee.lastName}...`);

      for (let dayOffset = 1; dayOffset <= daysToGenerate; dayOffset++) {
        // Go back dayOffset days from today
        const workDate = new Date(now);
        workDate.setDate(now.getDate() - dayOffset);
        
        // Skip weekends
        const dayOfWeek = workDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;

        // Check if events already exist for this day (simple check)
        // We use a broader check to avoid duplicates if re-run
        const startOfDay = new Date(workDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(workDate);
        endOfDay.setHours(23, 59, 59, 999);

        const existingEvents = await timeEventRepo.count({
          where: {
            employeeId: employee.id,
            happenedAt: Between(startOfDay, endOfDay),
          },
        });
        
        if (existingEvents > 0) continue;

        // Create a realistic work day with clock in, break, and clock out
        // Clock in at 9:00 AM
        const clockIn = new Date(workDate);
        clockIn.setHours(9, 0, 0, 0);

        // Break start at 12:00 PM
        const breakIn = new Date(workDate);
        breakIn.setHours(12, 0, 0, 0);

        // Break end at 1:00 PM
        const breakOut = new Date(workDate);
        breakOut.setHours(13, 0, 0, 0);

        // Clock out at 6:00 PM
        const clockOut = new Date(workDate);
        clockOut.setHours(18, 0, 0, 0);

        const events = [
          { type: TimeEventType.CLOCK_IN, happenedAt: clockIn },
          { type: TimeEventType.BREAK_IN, happenedAt: breakIn },
          { type: TimeEventType.BREAK_OUT, happenedAt: breakOut },
          { type: TimeEventType.CLOCK_OUT, happenedAt: clockOut },
        ];

        for (const event of events) {
          const timeEvent = timeEventRepo.create({
            employeeId: employee.id,
            type: event.type,
            happenedAt: event.happenedAt,
            source: TimeEventSource.KIOSK,
            requestId: randomUUID(),
          });
          await timeEventRepo.save(timeEvent);
          totalCreated++;
        }
      }
    }

    console.log(`  ✅ Created ${totalCreated} time events`);
  },
};
