import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDeductionsTable1704283200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE deductions (
        id SERIAL PRIMARY KEY,
        employee_id INT NOT NULL,
        type VARCHAR(50) NOT NULL,
        label VARCHAR(255) NOT NULL,
        calculation_type VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        effective_from DATE,
        effective_until DATE,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        deleted_at TIMESTAMP,
        CONSTRAINT fk_deduction_employee 
          FOREIGN KEY (employee_id) 
          REFERENCES employees(id) 
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_deductions_employee 
      ON deductions(employee_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_deductions_active 
      ON deductions(is_active) 
      WHERE deleted_at IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS deductions;`);
  }
}
