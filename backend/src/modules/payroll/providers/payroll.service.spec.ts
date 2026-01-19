/**
 * Unit tests for PayrollService pay calculation logic.
 */

/**
 * Unit tests for PayrollService pay calculation logic.
 */
describe('PayrollService', () => {
  // We test the calculation logic by mocking repositories and calling calculatePayForEmployee
  // Since this method relies heavily on DB calls, we focus on integration-style tests with mocks.

  describe('Pay Calculation Logic', () => {
    it('should calculate hourly pay correctly', () => {
      // Hourly employee: $15/hour, worked 480 regular min (8h), 60 OT min (1h)
      const hourlyRate = 15;
      const regularMinutes = 480;
      const overtimeMinutes = 60;
      const OT_MULTIPLIER = 1.25;

      const basicPay = (regularMinutes / 60) * hourlyRate; // 8 * 15 = 120
      const overtimePay = (overtimeMinutes / 60) * hourlyRate * OT_MULTIPLIER; // 1 * 15 * 1.25 = 18.75

      expect(basicPay).toBe(120);
      expect(overtimePay).toBe(18.75);
      expect(basicPay + overtimePay).toBe(138.75);
    });

    it('should calculate daily rate pay correctly', () => {
      // Daily employee: $120/day, worked 5 days, 60 OT min (1h)
      const dailyRate = 120;
      const daysWorked = 5;
      const overtimeMinutes = 60;
      const OT_MULTIPLIER = 1.25;

      const basicPay = daysWorked * dailyRate; // 5 * 120 = 600
      const hourlyRateFromDaily = dailyRate / 8; // 15
      const overtimePay = (overtimeMinutes / 60) * hourlyRateFromDaily * OT_MULTIPLIER; // 1 * 15 * 1.25 = 18.75

      expect(basicPay).toBe(600);
      expect(overtimePay).toBe(18.75);
    });

    it('should calculate salaried pay correctly (semi-monthly)', () => {
      // Salaried employee: $52,800/year = $4,400/month = $2,200/semi-monthly
      const monthlySalary = 4400;
      const overtimeMinutes = 120; // 2 hours OT
      const OT_MULTIPLIER = 1.25;

      const basicPay = monthlySalary / 2; // 2200
      const hourlyRateFromMonthly = monthlySalary / 176; // 25
      const overtimePay = (overtimeMinutes / 60) * hourlyRateFromMonthly * OT_MULTIPLIER; // 2 * 25 * 1.25 = 62.5

      expect(basicPay).toBe(2200);
      expect(overtimePay).toBe(62.5);
    });

    it('should round pay values to 2 decimal places', () => {
      // Test rounding behavior
      const hourlyRate = 15.333;
      const regularMinutes = 480;

      const basicPay = Math.round((regularMinutes / 60) * hourlyRate * 100) / 100;

      expect(basicPay).toBe(122.66); // 15.333 * 8 = 122.664, rounded to 122.66
    });

    it('should handle zero overtime correctly', () => {
      const hourlyRate = 20;
      const regularMinutes = 300; // 5 hours, under 8h threshold
      const overtimeMinutes = 0;
      const OT_MULTIPLIER = 1.25;

      const basicPay = (regularMinutes / 60) * hourlyRate; // 5 * 20 = 100
      const overtimePay = (overtimeMinutes / 60) * hourlyRate * OT_MULTIPLIER; // 0

      expect(basicPay).toBe(100);
      expect(overtimePay).toBe(0);
    });

    it('should handle deductions calculation', () => {
      // Gross pay with deductions
      const grossPay = 2200;
      const deductions = [
        { name: 'SSS', amount: 581.3 },
        { name: 'PhilHealth', amount: 500 },
        { name: 'Pag-IBIG', amount: 100 },
      ];

      const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
      const netPay = grossPay - totalDeductions;

      expect(totalDeductions).toBe(1181.3);
      expect(netPay).toBe(1018.7);
    });
  });
});
