import { DataSource } from 'typeorm';
import { User } from './src/entities/user.entity';
import { Employee } from './src/entities/employee.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Employee],
  synchronize: false,
});

async function checkData() {
  try {
    await dataSource.initialize();
    console.log('✅ Connected to database');

    const userRepo = dataSource.getRepository(User);
    const employeeRepo = dataSource.getRepository(Employee);

    const users = await userRepo.find({ relations: ['employee'] });
    const employees = await employeeRepo.find({ relations: ['user'] });

    console.log('\n--- USERS ---');
    users.forEach(u => {
      console.log(`ID: ${u.id} | Email: ${u.email} | Role: ${u.role} | EmployeeID: ${u.employeeId} | Linked Name: ${u.employee?.firstName} ${u.employee?.lastName}`);
    });

    console.log('\n--- EMPLOYEES ---');
    employees.forEach(e => {
      console.log(`ID: ${e.id} | Name: ${e.firstName} ${e.lastName} | Number: ${e.employeeNumber} | Linked User: ${e.user?.email}`);
    });

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkData();
