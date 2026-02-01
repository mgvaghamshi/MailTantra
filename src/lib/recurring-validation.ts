import { RecurringScheduleConfig } from '@/types/campaign';

export interface RecurringValidationError {
  field: string;
  message: string;
  code: string;
}

export interface RecurringValidationResult {
  isValid: boolean;
  errors: RecurringValidationError[];
  warnings: RecurringValidationError[];
}

export function validateRecurringSchedule(config: Partial<RecurringScheduleConfig>): RecurringValidationResult {
  const errors: RecurringValidationError[] = [];
  const warnings: RecurringValidationError[] = [];

  // Validate frequency
  if (!config.frequency) {
    errors.push({
      field: 'frequency',
      message: 'Frequency is required',
      code: 'FREQUENCY_REQUIRED'
    });
  }

  // Validate interval
  if (!config.interval || config.interval < 1) {
    errors.push({
      field: 'interval',
      message: 'Interval must be at least 1',
      code: 'INVALID_INTERVAL'
    });
  }

  // Validate interval limits
  if (config.interval && config.frequency) {
    if (config.frequency === 'daily' && config.interval > 365) {
      errors.push({
        field: 'interval',
        message: 'Daily interval cannot exceed 365 days',
        code: 'INTERVAL_TOO_LARGE'
      });
    }
    if (config.frequency === 'weekly' && config.interval > 52) {
      errors.push({
        field: 'interval',
        message: 'Weekly interval cannot exceed 52 weeks',
        code: 'INTERVAL_TOO_LARGE'
      });
    }
    if (config.frequency === 'monthly' && config.interval > 12) {
      errors.push({
        field: 'interval',
        message: 'Monthly interval cannot exceed 12 months',
        code: 'INTERVAL_TOO_LARGE'
      });
    }
  }

  // Validate days of week for weekly frequency
  if (config.frequency === 'weekly') {
    if (!config.days_of_week || config.days_of_week.length === 0) {
      errors.push({
        field: 'days_of_week',
        message: 'At least one day of week must be selected for weekly frequency',
        code: 'DAYS_OF_WEEK_REQUIRED'
      });
    }
  }

  // Validate monthly configuration
  if (config.frequency === 'monthly') {
    if (!config.monthly_type) {
      errors.push({
        field: 'monthly_type',
        message: 'Monthly type is required for monthly frequency',
        code: 'MONTHLY_TYPE_REQUIRED'
      });
    }

    if (config.monthly_type === 'day_of_month') {
      if (!config.day_of_month || config.day_of_month < 1 || config.day_of_month > 31) {
        errors.push({
          field: 'day_of_month',
          message: 'Day of month must be between 1 and 31',
          code: 'INVALID_DAY_OF_MONTH'
        });
      }
    }

    if (config.monthly_type === 'nth_weekday') {
      if (!config.week_number || config.week_number < 1 || config.week_number > 5) {
        errors.push({
          field: 'week_number',
          message: 'Week number must be between 1 and 5',
          code: 'INVALID_WEEK_NUMBER'
        });
      }
      if (!config.weekday) {
        errors.push({
          field: 'weekday',
          message: 'Weekday is required for nth weekday option',
          code: 'WEEKDAY_REQUIRED'
        });
      }
    }
  }

  // Validate time
  if (!config.time) {
    errors.push({
      field: 'time',
      message: 'Time is required',
      code: 'TIME_REQUIRED'
    });
  } else {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(config.time)) {
      errors.push({
        field: 'time',
        message: 'Time must be in HH:MM format',
        code: 'INVALID_TIME_FORMAT'
      });
    }
  }

  // Validate timezone
  if (!config.timezone) {
    errors.push({
      field: 'timezone',
      message: 'Timezone is required',
      code: 'TIMEZONE_REQUIRED'
    });
  }

  // Validate start date
  if (!config.start_date) {
    errors.push({
      field: 'start_date',
      message: 'Start date is required',
      code: 'START_DATE_REQUIRED'
    });
  } else {
    const startDate = new Date(config.start_date);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to start of day for comparison

    if (startDate < now) {
      errors.push({
        field: 'start_date',
        message: 'Start date cannot be in the past',
        code: 'START_DATE_IN_PAST'
      });
    }
  }

  // Validate end date and max occurrences
  if (!config.end_date && !config.max_occurrences) {
    warnings.push({
      field: 'end_condition',
      message: 'Consider setting an end date or maximum occurrences to prevent infinite recurring campaigns',
      code: 'NO_END_CONDITION'
    });
  }

  if (config.end_date && config.start_date) {
    const startDate = new Date(config.start_date);
    const endDate = new Date(config.end_date);

    if (endDate <= startDate) {
      errors.push({
        field: 'end_date',
        message: 'End date must be after start date',
        code: 'END_DATE_BEFORE_START'
      });
    }
  }

  if (config.max_occurrences && config.max_occurrences < 1) {
    errors.push({
      field: 'max_occurrences',
      message: 'Maximum occurrences must be at least 1',
      code: 'INVALID_MAX_OCCURRENCES'
    });
  }

  if (config.max_occurrences && config.max_occurrences > 1000) {
    warnings.push({
      field: 'max_occurrences',
      message: 'Large number of occurrences may impact performance',
      code: 'HIGH_MAX_OCCURRENCES'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function getRecurringSchedulePreview(config: RecurringScheduleConfig, count: number = 5): Date[] {
  const preview: Date[] = [];
  
  try {
    if (!config.start_date || !config.time) {
      return preview;
    }

    const startDate = new Date(config.start_date);
    const [hours, minutes] = config.time.split(':').map(Number);
    
    let currentDate = new Date(startDate);
    currentDate.setHours(hours, minutes, 0, 0);

    for (let i = 0; i < count && preview.length < count; i++) {
      switch (config.frequency) {
        case 'daily':
          if (i === 0) {
            preview.push(new Date(currentDate));
          } else {
            currentDate.setDate(currentDate.getDate() + config.interval);
            preview.push(new Date(currentDate));
          }
          break;

        case 'weekly':
          if (config.days_of_week && config.days_of_week.length > 0) {
            // For weekly, generate dates based on selected days
            const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const selectedDayNumbers = config.days_of_week.map(day => daysOfWeek.indexOf(day.toLowerCase()));
            
            let weekOffset = 0;
            while (preview.length < count) {
              for (const dayNumber of selectedDayNumbers) {
                if (preview.length >= count) break;
                
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + (weekOffset * 7) + (dayNumber - startDate.getDay()));
                date.setHours(hours, minutes, 0, 0);
                
                if (date >= startDate) {
                  preview.push(new Date(date));
                }
              }
              weekOffset += config.interval;
            }
          }
          break;

        case 'monthly':
          if (i === 0) {
            preview.push(new Date(currentDate));
          } else {
            currentDate.setMonth(currentDate.getMonth() + config.interval);
            preview.push(new Date(currentDate));
          }
          break;

        default:
          break;
      }
    }
  } catch (error) {
    console.error('Error generating preview:', error);
  }

  return preview.sort((a, b) => a.getTime() - b.getTime()).slice(0, count);
}

export function formatRecurringDescription(config: RecurringScheduleConfig): string {
  if (!config.frequency) return '';

  const parts: string[] = [];

  switch (config.frequency) {
    case 'daily':
      if (config.interval === 1) {
        parts.push('Daily');
      } else {
        parts.push(`Every ${config.interval} days`);
      }
      break;

    case 'weekly':
      if (config.interval === 1) {
        parts.push('Weekly');
      } else {
        parts.push(`Every ${config.interval} weeks`);
      }
      
      if (config.days_of_week && config.days_of_week.length > 0) {
        const dayNames = config.days_of_week.map(day => 
          day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
        );
        parts.push(`on ${dayNames.join(', ')}`);
      }
      break;

    case 'monthly':
      if (config.interval === 1) {
        parts.push('Monthly');
      } else {
        parts.push(`Every ${config.interval} months`);
      }

      if (config.monthly_type === 'day_of_month' && config.day_of_month) {
        parts.push(`on day ${config.day_of_month}`);
      } else if (config.monthly_type === 'nth_weekday' && config.week_number && config.weekday) {
        const weekNumbers = ['', 'first', 'second', 'third', 'fourth', 'fifth'];
        const weekName = weekNumbers[config.week_number] || `${config.week_number}th`;
        const dayName = config.weekday.charAt(0).toUpperCase() + config.weekday.slice(1).toLowerCase();
        parts.push(`on the ${weekName} ${dayName}`);
      }
      break;
  }

  if (config.time) {
    parts.push(`at ${config.time}`);
  }

  if (config.timezone) {
    parts.push(`(${config.timezone})`);
  }

  return parts.join(' ');
}
