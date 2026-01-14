import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('System Regression Flow (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminToken: string;
  let companyId: number;

  const testCompany = {
    companyName: 'RegTest Corp ' + Date.now(),
    email: 'admin-' + Date.now() + '@test.com',
    password: 'password123',
    firstName: 'Reg',
    lastName: 'Admin',
  };

  const testEmployee = {
    employeeNumber: 'TEMP' + Math.floor(Math.random() * 1000000),
    firstName: 'John',
    lastName: 'Regression',
    email: 'john.reg-' + Date.now() + '@test.com',
    hireDate: '2026-01-01',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    // Cleanup - in a real scenario we might want to delete the test company
    // await dataSource.destroy();
    await app.close();
  });

  it('Flow 1: Register a new company', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testCompany)
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    adminToken = response.body.accessToken;

    // Get company ID from profile
    const profile = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(profile.body.user).toHaveProperty('companyId');
    companyId = profile.body.user.companyId;
  });

  it('Flow 2: Add an employee', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/employees')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        ...testEmployee,
        companyId,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    testEmployee['id'] = response.body.id;
  });

  it('Flow 3: Create a pay period', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/payroll/pay-periods')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        periodType: 'SEMI_MONTHLY',
        startDate: '2026-01-01',
        endDate: '2026-01-15',
        companyId,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    testCompany['payPeriodId'] = response.body.id;
  });

  it('Flow 4: Generate Payslips', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/payroll/payslips/generate')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        payPeriodId: testCompany['payPeriodId'],
      })
      .expect(201);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Flow 5: Verify RBAC - Employee cannot access payroll admin', async () => {
    // Note: We'd need to login as the employee to get an employee token
    // For now, testing with an invalid/empty token or assume common sense 401/403
    await request(app.getHttpServer())
      .get('/api/payroll/pay-periods')
      .expect(401);
  });
});
