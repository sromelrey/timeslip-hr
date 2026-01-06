import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { TimeEventModule } from './modules/time-event/time-event.module';
import { TimesheetModule } from './modules/timesheet/timesheet.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    // Global config module
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Database configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Auto-create tables (dev only)
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
    
    // Feature modules
    AuthModule,
    ProductModule,
    EmployeeModule,
    TimeEventModule,
    TimesheetModule,
    PayrollModule,
    DashboardModule,
    DashboardModule,
    ReportsModule,
    SettingsModule,
  ],
})
export class AppModule {}
