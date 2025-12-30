import { DataSource } from 'typeorm';
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

    // Create time events for the current month (past days only)
    const now = new Date();
    const currentDay = now.getDate();
    
    // Generate events for the last 5 working days (or less if month just started)
    const daysToGenerate = Math.min(5, currentDay - 1);
    
    if (daysToGenerate <= 0) {
      console.log('  ⏭️  No past days in current month to generate events for.');
      return;
    }

    let totalCreated = 0;

    for (const employee of employees) {
      console.log(`  Creating time events for ${employee.firstName} ${employee.lastName}...`);

      for (let dayOffset = 1; dayOffset <= daysToGenerate; dayOffset++) {
        const workDate = new Date(now.getFullYear(), now.getMonth(), currentDay - dayOffset);
        
        // Skip weekends
        const dayOfWeek = workDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;

        // Check if events already exist for this day
        const existingEvents = await timeEventRepo.find({
          where: {
            employeeId: employee.id,
          },
        });
        
        const dayStr = workDate.toISOString().split('T')[0];
        const hasEventsForDay = existingEvents.some(e => 
          e.happenedAt.toISOString().split('T')[0] === dayStr
        );
        
        if (hasEventsForDay) continue;

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
