/**
 * Global DateTime Utility for EmailTracker
 * 
 * Normalizes all datetime values to ISO 8601 format before sending to backend.
 * Prevents datetime_parsing errors by ensuring consistent format.
 */

import { format, parseISO, isValid, parse } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

/**
 * Normalizes a date input to full ISO 8601 datetime string
 * 
 * @param date - Date string, Date object, or null/undefined
 * @param defaultTime - Default time to use if only date provided (HH:mm format)
 * @param timezone - Timezone to interpret the datetime in (defaults to UTC)
 * @returns ISO 8601 datetime string or null
 * 
 * Examples:
 * - normalizeDateTime('2025-08-24') → '2025-08-24T00:00:00Z'
 * - normalizeDateTime('2025-08-24', '10:00') → '2025-08-24T10:00:00Z'
 * - normalizeDateTime('2025-08-24T15:30:00') → '2025-08-24T15:30:00Z'
 * - normalizeDateTime(new Date()) → '2025-08-24T14:30:45Z'
 */
export function normalizeDateTime(
  date: string | Date | null | undefined,
  defaultTime: string = '00:00:00',
  timezone: string = 'UTC'
): string | null {
  if (!date) return null;

  try {
    let dateTime: Date;

    if (date instanceof Date) {
      dateTime = date;
    } else if (typeof date === 'string') {
      // Handle different input formats
      if (date.includes('T')) {
        // Already has time component (ISO format or similar)
        dateTime = parseISO(date);
      } else if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Date only format (YYYY-MM-DD)
        const timeStr = defaultTime.length === 5 ? `${defaultTime}:00` : defaultTime;
        const dateTimeStr = `${date}T${timeStr}`;
        dateTime = parseISO(dateTimeStr);
      } else {
        // Try to parse as-is
        dateTime = parseISO(date);
      }
    } else {
      throw new Error('Invalid date type');
    }

    // Validate the resulting date
    if (!isValid(dateTime)) {
      throw new Error('Invalid date value');
    }

    // Convert to UTC if timezone is specified and not UTC
    if (timezone !== 'UTC') {
      dateTime = fromZonedTime(dateTime, timezone);
    }

    // Return as ISO string
    return dateTime.toISOString();
  } catch (error) {
    console.error('DateTime normalization failed:', error, { date, defaultTime, timezone });
    return null;
  }
}

/**
 * Normalizes a time string to HH:mm:ss format
 * 
 * @param time - Time string in various formats
 * @returns Normalized time string or default
 * 
 * Examples:
 * - normalizeTime('9:30') → '09:30:00'
 * - normalizeTime('15:45') → '15:45:00'
 * - normalizeTime('09:30:45') → '09:30:45'
 */
export function normalizeTime(time: string | null | undefined, defaultTime: string = '00:00:00'): string {
  if (!time) return defaultTime;

  try {
    // Handle different time formats
    if (time.match(/^\d{1,2}:\d{2}$/)) {
      // HH:mm format, add seconds
      return `${time.padStart(5, '0')}:00`;
    } else if (time.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
      // HH:mm:ss format, ensure padding
      const parts = time.split(':');
      return parts.map(part => part.padStart(2, '0')).join(':');
    } else {
      // Try to parse and format
      const parsed = parse(time, 'H:mm', new Date());
      if (isValid(parsed)) {
        return format(parsed, 'HH:mm:ss');
      }
    }
  } catch (error) {
    console.error('Time normalization failed:', error, { time });
  }

  return defaultTime;
}

/**
 * Combines date and time inputs into a normalized ISO datetime
 * 
 * @param date - Date string or Date object
 * @param time - Time string (HH:mm or HH:mm:ss)
 * @param timezone - Timezone for the datetime
 * @returns ISO 8601 datetime string or null
 */
export function combineDateAndTime(
  date: string | Date | null | undefined,
  time: string | null | undefined,
  timezone: string = 'UTC'
): string | null {
  if (!date) return null;

  const normalizedTime = normalizeTime(time);
  return normalizeDateTime(date, normalizedTime, timezone);
}

/**
 * Validates that a datetime string is in the future
 * 
 * @param dateTime - ISO datetime string
 * @param minMinutesFromNow - Minimum minutes from current time
 * @returns True if datetime is valid and in future
 */
export function isValidFutureDateTime(dateTime: string | null, minMinutesFromNow: number = 1): boolean {
  if (!dateTime) return false;

  try {
    const date = parseISO(dateTime);
    if (!isValid(date)) return false;

    const now = new Date();
    const minFutureTime = new Date(now.getTime() + minMinutesFromNow * 60 * 1000);
    
    return date >= minFutureTime;
  } catch {
    return false;
  }
}

/**
 * Formats a datetime for display in a specific timezone
 * 
 * @param dateTime - ISO datetime string
 * @param timezone - Target timezone
 * @param formatStr - Format string (date-fns format)
 * @returns Formatted datetime string
 */
export function formatDateTimeInTimezone(
  dateTime: string | null,
  timezone: string = 'UTC',
  formatStr: string = 'yyyy-MM-dd HH:mm:ss'
): string {
  if (!dateTime) return '';

  try {
    const date = parseISO(dateTime);
    if (!isValid(date)) return '';

    const zonedDate = toZonedTime(date, timezone);
    return format(zonedDate, formatStr);
  } catch (error) {
    console.error('DateTime formatting failed:', error, { dateTime, timezone, formatStr });
    return '';
  }
}

/**
 * Extracts just the date portion (YYYY-MM-DD) from any date input
 * 
 * @param date - Date string, Date object, or null/undefined
 * @returns Date string in YYYY-MM-DD format or null
 * 
 * Examples:
 * - extractDateOnly('2025-08-24T15:30:00Z') → '2025-08-24'
 * - extractDateOnly('2025-08-24') → '2025-08-24'
 * - extractDateOnly(new Date()) → '2025-08-24'
 */
export function extractDateOnly(date: string | Date | null | undefined): string | null {
  if (!date) return null;

  try {
    let dateObj: Date;

    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string') {
      if (date.includes('T')) {
        // Has time component, parse as ISO
        dateObj = parseISO(date);
      } else if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Already in YYYY-MM-DD format
        return date;
      } else {
        // Try to parse as-is
        dateObj = parseISO(date);
      }
    } else {
      throw new Error('Invalid date type');
    }

    // Validate the resulting date
    if (!isValid(dateObj)) {
      throw new Error('Invalid date value');
    }

    // Return as YYYY-MM-DD format
    return format(dateObj, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Date extraction failed:', error, { date });
    return null;
  }
}

/**
 * Type-safe recurring schedule datetime normalizer
 * Specifically for recurring campaign API payloads
 */
export interface RecurringScheduleDateTime {
  start_date: string;
  end_date?: string;
  time: string;
  timezone: string;
}

export function normalizeRecurringSchedule(
  schedule: {
    start_date?: string | Date | null;
    end_date?: string | Date | null;
    time?: string;
    timezone?: string;
  }
): RecurringScheduleDateTime {
  const timezone = schedule.timezone || 'UTC';
  const time = normalizeTime(schedule.time);
  
  // For recurring schedules, backend expects YYYY-MM-DD format for dates
  const start_date = extractDateOnly(schedule.start_date);
  const end_date = schedule.end_date ? extractDateOnly(schedule.end_date) : undefined;

  if (!start_date) {
    throw new Error('start_date is required for recurring schedule');
  }

  return {
    start_date,
    end_date: end_date || undefined,
    time,
    timezone
  };
}
