/**
 * Professional-grade time formatting utilities for EmailTracker dashboard
 * Provides consistent relative time formatting with auto-update capabilities
 */

import { formatDistanceToNowStrict, format, parseISO, isValid } from 'date-fns';
import type { Locale } from 'date-fns';

export interface TimeFormatOptions {
  /** Include seconds in formatting */
  includeSeconds?: boolean;
  /** Add suffix like "ago" or "in" */
  addSuffix?: boolean;
  /** Format style: 'relative', 'absolute', or 'smart' */
  style?: 'relative' | 'absolute' | 'smart';
  /** Timezone locale for formatting */
  locale?: Locale;
}

export interface FormattedTime {
  /** Human-readable relative time (e.g., "22 minutes ago") */
  relative: string;
  /** Formatted absolute time (e.g., "Jan 15, 2025 at 3:30 PM") */
  absolute: string;
  /** ISO timestamp */
  iso: string;
  /** Raw date object */
  date: Date;
  /** Whether the time is in the future */
  isFuture: boolean;
  /** Whether the time is today */
  isToday: boolean;
  /** Time zone offset in minutes */
  timezoneOffset: number;
}

/**
 * Parse and validate timestamp input
 */
export function parseTimestamp(timestamp: string | Date | null | undefined): Date | null {
  if (!timestamp) return null;
  
  try {
    let date: Date;
    
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string') {
      // Try parsing ISO string first
      date = parseISO(timestamp);
      
      // If that fails, try standard Date parsing
      if (!isValid(date)) {
        date = new Date(timestamp);
      }
    } else {
      return null;
    }
    
    return isValid(date) ? date : null;
  } catch (error) {
    console.warn('Failed to parse timestamp:', timestamp, error);
    return null;
  }
}

/**
 * Format a timestamp into human-readable relative time
 */
export function formatRelativeTime(
  timestamp: string | Date | null | undefined,
  options: TimeFormatOptions = {}
): string {
  const date = parseTimestamp(timestamp);
  if (!date) return 'Unknown time';
  
  const {
    includeSeconds = false,
    addSuffix = true,
    style = 'relative'
  } = options;
  
  try {
    const now = new Date();
    const diffMs = Math.abs(date.getTime() - now.getTime());
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    const isInFuture = date.getTime() > now.getTime();
    const suffix = addSuffix ? (isInFuture ? ' from now' : ' ago') : '';
    
    // Handle very recent times
    if (diffSeconds < 30 && !includeSeconds) {
      return 'Just now';
    }
    
    // Handle smart formatting for different time ranges
    if (style === 'smart') {
      if (diffDays > 7) {
        // More than a week: show absolute date
        return format(date, 'MMM d, yyyy');
      } else if (diffDays >= 1) {
        // 1-7 days: show day with time
        return format(date, 'MMM d \'at\' h:mm a');
      }
      // Less than a day: fall through to relative
    }
    
    // Professional relative time formatting
    if (diffYears >= 1) {
      const years = diffYears;
      return `${years} ${years === 1 ? 'year' : 'years'}${suffix}`;
    } else if (diffMonths >= 1) {
      const months = diffMonths;
      return `${months} ${months === 1 ? 'month' : 'months'}${suffix}`;
    } else if (diffWeeks >= 1) {
      const weeks = diffWeeks;
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}${suffix}`;
    } else if (diffDays >= 1) {
      const days = diffDays;
      return `${days} ${days === 1 ? 'day' : 'days'}${suffix}`;
    } else if (diffHours >= 1) {
      const hours = diffHours;
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}${suffix}`;
    } else if (diffMinutes >= 1) {
      const minutes = diffMinutes;
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}${suffix}`;
    } else if (includeSeconds) {
      const seconds = diffSeconds;
      return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}${suffix}`;
    } else {
      return 'Just now';
    }
    
  } catch (error) {
    console.warn('Failed to format relative time:', timestamp, error);
    return 'Invalid time';
  }
}

/**
 * Get comprehensive time formatting information
 */
export function getTimeInfo(
  timestamp: string | Date | null | undefined,
  options: TimeFormatOptions = {}
): FormattedTime | null {
  const date = parseTimestamp(timestamp);
  if (!date) return null;
  
  const now = new Date();
  const isFuture = date.getTime() > now.getTime();
  const isToday = date.toDateString() === now.toDateString();
  
  return {
    relative: formatRelativeTime(timestamp, options),
    absolute: format(date, 'MMM d, yyyy \'at\' h:mm a'),
    iso: date.toISOString(),
    date,
    isFuture,
    isToday,
    timezoneOffset: date.getTimezoneOffset()
  };
}

/**
 * Format duration between two timestamps
 */
export function formatDuration(
  startTime: string | Date | null | undefined,
  endTime: string | Date | null | undefined
): string {
  const start = parseTimestamp(startTime);
  const end = parseTimestamp(endTime);
  
  if (!start || !end) return 'Unknown duration';
  
  const diffMs = Math.abs(end.getTime() - start.getTime());
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  } else if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  } else if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Check if a timestamp is within a specific time range
 */
export function isWithinTimeRange(
  timestamp: string | Date | null | undefined,
  rangeMinutes: number
): boolean {
  const date = parseTimestamp(timestamp);
  if (!date) return false;
  
  const now = new Date();
  const diffMs = Math.abs(now.getTime() - date.getTime());
  const diffMinutes = diffMs / (1000 * 60);
  
  return diffMinutes <= rangeMinutes;
}

/**
 * Get time-based status indicator
 */
export function getTimeStatus(
  timestamp: string | Date | null | undefined
): 'recent' | 'moderate' | 'old' | 'future' | 'unknown' {
  const date = parseTimestamp(timestamp);
  if (!date) return 'unknown';
  
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMinutes = Math.abs(diffMs) / (1000 * 60);
  
  if (diffMs > 0) return 'future';
  
  if (diffMinutes <= 30) return 'recent';
  if (diffMinutes <= 1440) return 'moderate'; // 24 hours
  return 'old';
}

/**
 * Format timestamp for specific contexts
 */
export const formatters = {
  /** Format for table cells */
  table: (timestamp: string | Date | null | undefined) => 
    formatRelativeTime(timestamp, { style: 'smart' }),
  
  /** Format for detailed views */
  detailed: (timestamp: string | Date | null | undefined) => {
    const info = getTimeInfo(timestamp);
    return info ? `${info.relative} (${info.absolute})` : 'Unknown time';
  },
  
  /** Format for compact displays */
  compact: (timestamp: string | Date | null | undefined) => 
    formatRelativeTime(timestamp, { addSuffix: false }),
  
  /** Format for session activity */
  activity: (timestamp: string | Date | null | undefined) => {
    const info = getTimeInfo(timestamp);
    if (!info) return 'Unknown';
    
    if (info.isToday) {
      return format(info.date, 'h:mm a');
    } else {
      return formatRelativeTime(timestamp, { style: 'smart' });
    }
  },
  
  /** Format for audit logs */
  audit: (timestamp: string | Date | null | undefined) => {
    const info = getTimeInfo(timestamp);
    if (!info) return 'Unknown time';
    
    return `${info.relative} (${format(info.date, 'MMM d, h:mm a')})`;
  }
};

/**
 * Utility class for auto-updating time displays
 */
export class TimeUpdater {
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private callbacks: Map<string, () => void> = new Map();
  
  /**
   * Register a callback to update time display periodically
   */
  register(id: string, callback: () => void, intervalMs: number = 60000): void {
    // Clear existing interval if any
    this.unregister(id);
    
    // Store callback
    this.callbacks.set(id, callback);
    
    // Set up interval
    const interval = setInterval(callback, intervalMs);
    this.intervals.set(id, interval);
  }
  
  /**
   * Unregister a time update callback
   */
  unregister(id: string): void {
    const interval = this.intervals.get(id);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(id);
    }
    this.callbacks.delete(id);
  }
  
  /**
   * Update all registered callbacks immediately
   */
  updateAll(): void {
    this.callbacks.forEach(callback => callback());
  }
  
  /**
   * Clean up all intervals
   */
  cleanup(): void {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
    this.callbacks.clear();
  }
}

// Global time updater instance
export const globalTimeUpdater = new TimeUpdater();

// Clean up on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    globalTimeUpdater.cleanup();
  });
}
