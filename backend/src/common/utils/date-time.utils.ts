/**
 * Date/Time Utility Functions
 * Provides helpers for time rounding, duration calculations, and formatting.
 */

/**
 * Rounds a date to the nearest interval in minutes.
 * @param date - The date to round.
 * @param intervalMinutes - The interval to round to (default 15).
 * @param direction - 'up', 'down', or 'nearest' (default 'nearest').
 * @returns A new Date rounded to the specified interval.
 */
export function roundToInterval(
  date: Date,
  intervalMinutes: number = 15,
  direction: 'up' | 'down' | 'nearest' = 'nearest',
): Date {
  const ms = intervalMinutes * 60 * 1000;
  const time = date.getTime();

  if (direction === 'up') {
    return new Date(Math.ceil(time / ms) * ms);
  } else if (direction === 'down') {
    return new Date(Math.floor(time / ms) * ms);
  } else {
    return new Date(Math.round(time / ms) * ms);
  }
}

/**
 * Calculates the duration between two dates in minutes.
 * @param start - Start date.
 * @param end - End date.
 * @returns Duration in minutes.
 */
export function getDurationMinutes(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}

/**
 * Formats minutes into an "HH:MM" string.
 * @param totalMinutes - Total minutes.
 * @returns Formatted string (e.g., "08:30").
 */
export function formatMinutesToHHMM(totalMinutes: number): string {
  const hours = Math.floor(Math.abs(totalMinutes) / 60);
  const minutes = Math.abs(totalMinutes) % 60;
  const sign = totalMinutes < 0 ? '-' : '';
  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Converts minutes to hours with decimal precision.
 * @param minutes - Total minutes.
 * @param precision - Decimal places (default 2).
 * @returns Hours as a decimal number.
 */
export function minutesToHours(minutes: number, precision: number = 2): number {
  return parseFloat((minutes / 60).toFixed(precision));
}
