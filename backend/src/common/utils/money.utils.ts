/**
 * Money Utility Functions
 * Provides helpers for currency calculations and formatting.
 */

const DEFAULT_PRECISION = 2;

/**
 * Rounds a number to a specified precision for currency.
 * Uses "round half away from zero" (standard rounding).
 * @param value - The number to round.
 * @param precision - Decimal places (default 2).
 * @returns The rounded number.
 */
export function roundCurrency(value: number, precision: number = DEFAULT_PRECISION): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

/**
 * Calculates gross pay for hourly employees.
 * @param totalMinutes - Total worked minutes.
 * @param hourlyRate - Hourly rate.
 * @returns The calculated gross pay.
 */
export function calculateGrossPayHourly(totalMinutes: number, hourlyRate: number): number {
  const hours = totalMinutes / 60;
  return roundCurrency(hours * hourlyRate);
}

/**
 * Calculates gross pay for daily employees.
 * @param daysWorked - Number of days worked.
 * @param dailyRate - Daily rate.
 * @returns The calculated gross pay.
 */
export function calculateGrossPayDaily(daysWorked: number, dailyRate: number): number {
  return roundCurrency(daysWorked * dailyRate);
}

/**
 * Calculates gross pay for salaried employees per pay period.
 * @param monthlySalary - Monthly salary.
 * @param payPeriodsPerMonth - Number of pay periods per month (e.g., 2 for semi-monthly).
 * @returns The calculated gross pay for the period.
 */
export function calculateGrossPaySalaried(monthlySalary: number, payPeriodsPerMonth: number): number {
  return roundCurrency(monthlySalary / payPeriodsPerMonth);
}

/**
 * Formats a number as a currency string.
 * @param value - The number to format.
 * @param currency - Currency code (default 'PHP').
 * @param locale - Locale for formatting (default 'en-PH').
 * @returns Formatted currency string.
 */
export function formatCurrency(value: number, currency: string = 'PHP', locale: string = 'en-PH'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}
