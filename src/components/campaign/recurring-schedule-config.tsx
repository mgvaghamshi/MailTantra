"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Calendar, 
  Clock, 
  Repeat, 
  AlertCircle, 
  Info, 
  Crown, 
  CheckCircle, 
  XCircle,
  CalendarDays,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FeatureGate } from "@/components/feature-gate";
import { useSubscription } from "@/contexts/subscription-context";
import emailTrackerAPI from "@/lib/emailtracker-api";
import { normalizeDateTime, combineDateAndTime, normalizeRecurringSchedule, extractDateOnly } from "@/lib/datetime-utils";
import type { CampaignFormData, ValidationError } from "@/types/campaign";

// Enhanced configuration interface matching backend
interface RecurringScheduleConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number;
  days_of_week?: string[];
  monthly_type?: 'day_of_month' | 'nth_weekday';
  day_of_month?: number;
  week_number?: number;
  weekday?: string;
  time: string;
  timezone: string;
  start_date: string;
  end_date?: string;
  max_occurrences?: number;
  skip_weekends: boolean;
  skip_holidays: boolean;
  holiday_region?: string;
  custom_rrule?: string;
}

interface RecurringConfigProps {
  data: Partial<CampaignFormData>;
  errors: ValidationError[];
  onChange: (data: Partial<CampaignFormData>) => void;
}

interface ValidationResult {
  is_valid: boolean;
  errors: Array<{field: string; message: string; code: string}>;
  warnings: string[];
  normalized_config?: RecurringScheduleConfig;
  rrule?: string;
  preview_dates: string[];
}

// Enhanced frequency options with intervals
const frequencyOptions = [
  { 
    value: 'daily', 
    label: 'Daily', 
    description: 'Send every X days',
    tier: 'pro',
    supportsInterval: true,
    maxInterval: 365,
    intervalLabel: 'days'
  },
  { 
    value: 'weekly', 
    label: 'Weekly', 
    description: 'Send every X weeks on selected days',
    tier: 'pro',
    supportsInterval: true,
    maxInterval: 52,
    intervalLabel: 'weeks'
  },
  { 
    value: 'monthly', 
    label: 'Monthly', 
    description: 'Send on specific day each month',
    tier: 'pro',
    supportsInterval: true,
    maxInterval: 12,
    intervalLabel: 'months'
  },
  { 
    value: 'custom', 
    label: 'Custom (RRULE)', 
    description: 'Advanced RRULE configuration',
    tier: 'enterprise',
    supportsInterval: false
  }
];

const weekdays = [
  { value: 'monday', label: 'Mon', fullLabel: 'Monday' },
  { value: 'tuesday', label: 'Tue', fullLabel: 'Tuesday' },
  { value: 'wednesday', label: 'Wed', fullLabel: 'Wednesday' },
  { value: 'thursday', label: 'Thu', fullLabel: 'Thursday' },
  { value: 'friday', label: 'Fri', fullLabel: 'Friday' },
  { value: 'saturday', label: 'Sat', fullLabel: 'Saturday' },
  { value: 'sunday', label: 'Sun', fullLabel: 'Sunday' }
];

const timezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'US/Eastern', label: 'US Eastern' },
  { value: 'US/Central', label: 'US Central' },
  { value: 'US/Mountain', label: 'US Mountain' },
  { value: 'US/Pacific', label: 'US Pacific' },
  { value: 'Europe/London', label: 'Europe/London' },
  { value: 'Europe/Paris', label: 'Europe/Paris' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney' }
];

const holidayRegions = [
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'EU', label: 'European Union' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' }
];

export function RecurringScheduleConfig({ data, errors, onChange }: RecurringConfigProps) {
  const { hasFeature } = useSubscription();
  
  // Helper to create default config
  const createDefaultConfig = useCallback((): RecurringScheduleConfig => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    return {
      frequency: 'weekly',
      interval: 1,
      days_of_week: ['monday'],
      time: '09:00',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      start_date: tomorrowStr,
      skip_weekends: false,
      skip_holidays: false,
      holiday_region: 'US',
      monthly_type: 'day_of_month',
      day_of_month: 1,
      week_number: 1,
      weekday: 'monday'
    };
  }, []);

  // State for configuration
  const [config, setConfig] = useState<RecurringScheduleConfig>(() => {
    const defaultConfig = createDefaultConfig();
    
    // If we have existing recurring config, merge it with defaults
    if (data.recurringConfig) {
      console.log('🔄 Initial state: restoring recurring config from data:', data.recurringConfig);
      return { ...defaultConfig, ...data.recurringConfig };
    }
    
    return defaultConfig;
  });

  // State for validation and preview
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [limitType, setLimitType] = useState<'end_date' | 'max_occurrences'>(() => {
    // Initialize limit type based on existing data
    if (data.recurringConfig?.end_date || data.recurringEndDate) {
      return 'end_date';
    } else if (data.recurringConfig?.max_occurrences || data.recurringMaxOccurrences) {
      return 'max_occurrences';
    }
    return 'max_occurrences'; // Default
  });

  // Get current frequency option
  const currentFrequencyOption = frequencyOptions.find(opt => opt.value === config.frequency);

  // Watch for changes in data to restore configuration from draft
  useEffect(() => {
    console.log('🔄 useEffect triggered with data:', { 
      recurringConfig: data.recurringConfig, 
      recurringStartDate: data.recurringStartDate, 
      recurringEndDate: data.recurringEndDate,
      recurringMaxOccurrences: data.recurringMaxOccurrences 
    });

    if (data.recurringConfig && Object.keys(data.recurringConfig).length > 0) {
      console.log('🔄 Restoring config from recurringConfig:', data.recurringConfig);
      const defaultConfig = createDefaultConfig();
      const restoredConfig = { ...data.recurringConfig };
      
      // Normalize dates during restoration to ensure YYYY-MM-DD format for form inputs
      if (restoredConfig.start_date) {
        restoredConfig.start_date = extractDateOnly(restoredConfig.start_date) || restoredConfig.start_date;
      }
      if (restoredConfig.end_date) {
        restoredConfig.end_date = extractDateOnly(restoredConfig.end_date) || restoredConfig.end_date;
      }
      
      const mergedConfig = { ...defaultConfig, ...restoredConfig };
      console.log('🔄 Normalized and merged config:', mergedConfig);
      
      // Also check for dates in the separate form fields (fallback)
      if (!mergedConfig.start_date && data.recurringStartDate) {
        mergedConfig.start_date = extractDateOnly(data.recurringStartDate) || data.recurringStartDate;
        console.log('🔄 Using fallback start date from recurringStartDate:', data.recurringStartDate, '→', mergedConfig.start_date);
      }
      if (!mergedConfig.end_date && data.recurringEndDate) {
        mergedConfig.end_date = extractDateOnly(data.recurringEndDate) || data.recurringEndDate;
        console.log('🔄 Using fallback end date from recurringEndDate:', data.recurringEndDate, '→', mergedConfig.end_date);
      }
      if (!mergedConfig.max_occurrences && data.recurringMaxOccurrences) {
        mergedConfig.max_occurrences = data.recurringMaxOccurrences;
        console.log('🔄 Using fallback max occurrences:', data.recurringMaxOccurrences);
      }
      
      setConfig(mergedConfig);
      console.log('🔄 Final merged config:', mergedConfig);
      
      // Update limit type based on the restored data
      if (mergedConfig.end_date || data.recurringEndDate) {
        setLimitType('end_date');
        console.log('🔄 Set limit type to end_date');
      } else if (mergedConfig.max_occurrences || data.recurringMaxOccurrences) {
        setLimitType('max_occurrences');
        console.log('🔄 Set limit type to max_occurrences');
      }
    } else if (data.recurringStartDate || data.recurringEndDate || data.recurringMaxOccurrences) {
      // Handle case where we only have the separate form fields (no recurringConfig)
      console.log('🔄 No recurringConfig but found separate date fields, updating...');
      const updates: Partial<RecurringScheduleConfig> = {};
      
      if (data.recurringStartDate) {
        updates.start_date = extractDateOnly(data.recurringStartDate) || data.recurringStartDate;
        console.log('🔄 Setting start date from recurringStartDate:', data.recurringStartDate, '→', updates.start_date);
      }
      if (data.recurringEndDate) {
        updates.end_date = extractDateOnly(data.recurringEndDate) || data.recurringEndDate;
        setLimitType('end_date');
        console.log('🔄 Setting end date from recurringEndDate:', data.recurringEndDate, '→', updates.end_date);
      }
      if (data.recurringMaxOccurrences && !data.recurringEndDate) {
        updates.max_occurrences = data.recurringMaxOccurrences;
        setLimitType('max_occurrences');
        console.log('🔄 Setting max occurrences:', data.recurringMaxOccurrences);
      }
      
      if (Object.keys(updates).length > 0) {
        setConfig(prev => ({ ...prev, ...updates }));
        console.log('🔄 Updated config with separate date fields:', updates);
      }
    }
  }, [data.recurringConfig, data.recurringStartDate, data.recurringEndDate, data.recurringMaxOccurrences, createDefaultConfig]);

  // Validate configuration whenever it changes
  const validateConfiguration = useCallback(async () => {
    // Don't validate if missing required fields
    if (!config.start_date || !config.time) {
      setValidationResult(null);
      return;
    }

    // Don't validate if start date is too far in past (likely initial state)
    const startDate = new Date(config.start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      setValidationResult(null);
      return;
    }

    // Don't validate weekly without days selected
    if (config.frequency === 'weekly' && (!config.days_of_week || config.days_of_week.length === 0)) {
      setValidationResult(null);
      return;
    }

    // Don't validate custom without RRULE
    if (config.frequency === 'custom' && !config.custom_rrule) {
      setValidationResult(null);
      return;
    }

    setIsValidating(true);
    try {
      // Debug: Log the raw config state first
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Raw config state before normalization:', {
          start_date: config.start_date,
          end_date: config.end_date,
          start_date_type: typeof config.start_date,
          end_date_type: typeof config.end_date
        });
      }

      // Ensure we have required fields
      if (!config.start_date) {
        setValidationResult({
          is_valid: false,
          errors: [{ field: 'start_date', message: 'Start date is required', code: 'REQUIRED' }],
          warnings: [],
          preview_dates: []
        });
        setIsValidating(false);
        return;
      }

      // Simple, direct date extraction - ensure YYYY-MM-DD format
      let normalizedStartDate: string;
      let normalizedEndDate: string | undefined;

      // Handle start date
      if (typeof config.start_date === 'string') {
        if (config.start_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // Already in correct format
          normalizedStartDate = config.start_date;
        } else if (config.start_date.includes('T')) {
          // ISO datetime, extract date part
          normalizedStartDate = config.start_date.split('T')[0];
        } else {
          // Try to parse and format
          const date = new Date(config.start_date);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid start date');
          }
          normalizedStartDate = date.toISOString().split('T')[0];
        }
      } else {
        throw new Error('Start date must be a string');
      }

      // Handle end date (optional)
      if (config.end_date && typeof config.end_date === 'string') {
        if (config.end_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // Already in correct format
          normalizedEndDate = config.end_date;
        } else if (config.end_date.includes('T')) {
          // ISO datetime, extract date part
          normalizedEndDate = config.end_date.split('T')[0];
        } else {
          // Try to parse and format
          const date = new Date(config.end_date);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid end date');
          }
          normalizedEndDate = date.toISOString().split('T')[0];
        }
      }

      // Prepare validation payload with normalized datetime
      const validationPayload = {
        frequency: config.frequency,
        interval: config.interval,
        time: config.time,
        timezone: config.timezone,
        start_date: normalizedStartDate,
        skip_weekends: config.skip_weekends,
        skip_holidays: config.skip_holidays,
        holiday_region: config.holiday_region,
        ...(limitType === 'end_date' && normalizedEndDate ? { end_date: normalizedEndDate } : {}),
        ...(limitType === 'max_occurrences' && config.max_occurrences ? { max_occurrences: config.max_occurrences } : {}),
        ...(config.frequency === 'weekly' ? { days_of_week: config.days_of_week } : {}),
        ...(config.frequency === 'monthly' ? {
          monthly_type: config.monthly_type,
          ...(config.monthly_type === 'day_of_month' ? { day_of_month: config.day_of_month } : {}),
          ...(config.monthly_type === 'nth_weekday' ? { 
            week_number: config.week_number,
            weekday: config.weekday 
          } : {})
        } : {}),
        ...(config.frequency === 'custom' ? { custom_rrule: config.custom_rrule } : {})
      };

      // Debug: Log the payload being sent to backend (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('📤 Final validation payload:', {
          frequency: config.frequency,
          interval: config.interval,
          time: config.time,
          timezone: config.timezone,
          start_date: normalizedStartDate,
          end_date: normalizedEndDate,
          skip_weekends: config.skip_weekends,
          skip_holidays: config.skip_holidays,
          // Additional debug info
          debug_info: {
            original_start_date: config.start_date,
            original_end_date: config.end_date,
            limitType: limitType
          }
        });
      }

      // Call backend validation
      const result = await emailTrackerAPI.validateRecurringSchedule(validationPayload);
      setValidationResult(result);
      
      // Update parent component only if validation is successful
      if (result.is_valid) {
        // For frontend state, we keep the original datetime format
        // The backend validation already confirmed the dates are valid
        onChange({
          recurringConfig: config
        });
      }

    } catch (error) {
      console.error('Validation failed:', error);
      setValidationResult({
        is_valid: false,
        errors: [{ field: 'general', message: 'Validation failed. Please check your configuration.', code: 'VALIDATION_ERROR' }],
        warnings: [],
        preview_dates: []
      });
    } finally {
      setIsValidating(false);
    }
  }, [config, limitType, onChange]);

  // Debounced validation with longer delay
  useEffect(() => {
    const timeoutId = setTimeout(validateConfiguration, 1500); // Increased to 1.5 seconds
    return () => clearTimeout(timeoutId);
  }, [
    config.frequency,
    config.interval, 
    config.start_date,
    config.end_date,
    config.max_occurrences,
    config.time,
    config.timezone,
    config.days_of_week,
    config.monthly_type,
    config.day_of_month,
    config.week_number,
    config.weekday,
    config.custom_rrule,
    limitType
  ]); // Only trigger on specific field changes

  // Update config helper
  const updateConfig = useCallback((updates: Partial<RecurringScheduleConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  // Get validation status for display
  const validationStatus = useMemo(() => {
    if (isValidating) return 'validating';
    if (!validationResult) return 'pending';
    return validationResult.is_valid ? 'valid' : 'invalid';
  }, [isValidating, validationResult]);

  // Format preview dates for display
  const formatPreviewDates = useCallback((dates: string[]) => {
    return dates.slice(0, 5).map(date => {
      const dt = new Date(date);
      return dt.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with validation status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Repeat className="w-5 h-5" />
                Recurring Schedule Configuration
              </CardTitle>
              <CardDescription>
                Configure when your campaign should be sent automatically
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {validationStatus === 'validating' && (
                <Badge variant="secondary" className="gap-1">
                  <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                  Validating...
                </Badge>
              )}
              {validationStatus === 'valid' && (
                <Badge variant="default" className="bg-green-600 gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Valid
                </Badge>
              )}
              {validationStatus === 'invalid' && (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="w-3 h-3" />
                  Invalid
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Frequency Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Frequency</CardTitle>
              <CardDescription>How often should this campaign be sent?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {frequencyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateConfig({ frequency: option.value as any })}
                    className={cn(
                      "w-full p-4 border rounded-lg text-left transition-all",
                      config.frequency === option.value
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                      </div>
                      {option.tier === 'enterprise' && (
                        <Crown className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Interval Configuration */}
              {currentFrequencyOption?.supportsInterval && (
                <div className="pt-4 border-t">
                  <Label htmlFor="interval">
                    Send every {config.interval} {currentFrequencyOption.intervalLabel}
                  </Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      id="interval"
                      type="number"
                      min="1"
                      max={currentFrequencyOption.maxInterval}
                      value={config.interval}
                      onChange={(e) => updateConfig({ interval: parseInt(e.target.value) || 1 })}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-600">
                      {currentFrequencyOption.intervalLabel}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Frequency-Specific Configuration */}
          {config.frequency === 'weekly' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Days of Week</CardTitle>
                <CardDescription>Select which days to send the campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {weekdays.map((day) => (
                    <div key={day.value} className="flex flex-col items-center">
                      <Checkbox
                        id={day.value}
                        checked={config.days_of_week?.includes(day.value) || false}
                        onCheckedChange={(checked) => {
                          const currentDays = config.days_of_week || [];
                          const newDays = checked
                            ? [...currentDays, day.value]
                            : currentDays.filter(d => d !== day.value);
                          updateConfig({ days_of_week: newDays });
                        }}
                      />
                      <Label 
                        htmlFor={day.value} 
                        className="text-xs mt-1 cursor-pointer"
                        title={day.fullLabel}
                      >
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {config.frequency === 'monthly' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Options</CardTitle>
                <CardDescription>Choose how to schedule monthly sends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={config.monthly_type}
                  onValueChange={(value: string) => updateConfig({ monthly_type: value as 'day_of_month' | 'nth_weekday' })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="day_of_month" id="day_of_month" />
                    <Label htmlFor="day_of_month">On day of month</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nth_weekday" id="nth_weekday" />
                    <Label htmlFor="nth_weekday">On specific weekday</Label>
                  </div>
                </RadioGroup>

                {config.monthly_type === 'day_of_month' && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="day_of_month_input">Day of month (1-31)</Label>
                    <Input
                      id="day_of_month_input"
                      type="number"
                      min="1"
                      max="31"
                      value={config.day_of_month}
                      onChange={(e) => updateConfig({ day_of_month: parseInt(e.target.value) || 1 })}
                      className="w-24"
                    />
                    {(config.day_of_month || 0) > 28 && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Day {config.day_of_month} will fallback to the last day for months with fewer days.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {config.monthly_type === 'nth_weekday' && (
                  <div className="ml-6 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="week_number">Week</Label>
                        <Select
                          value={config.week_number?.toString()}
                          onValueChange={(value) => updateConfig({ week_number: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1st</SelectItem>
                            <SelectItem value="2">2nd</SelectItem>
                            <SelectItem value="3">3rd</SelectItem>
                            <SelectItem value="4">4th</SelectItem>
                            <SelectItem value="5">Last</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="weekday">Weekday</Label>
                        <Select
                          value={config.weekday}
                          onValueChange={(value) => updateConfig({ weekday: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {weekdays.map((day) => (
                              <SelectItem key={day.value} value={day.value}>
                                {day.fullLabel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {config.frequency === 'custom' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Custom RRULE</CardTitle>
                <CardDescription>Enter a custom RRULE for advanced scheduling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="FREQ=WEEKLY;BYDAY=MO,WE,FR;INTERVAL=1"
                  value={config.custom_rrule || ''}
                  onChange={(e) => updateConfig({ custom_rrule: e.target.value })}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-600">
                  Enter a valid RRULE string. See{' '}
                  <a 
                    href="https://icalendar.org/iCalendar-RFC-5545/3-8-5-3-recurrence-rule.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    RFC 5545
                  </a>{' '}
                  for details.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Date Range */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Date Range</CardTitle>
              <CardDescription>When should the recurring campaign start and end?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={config.start_date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    console.log('📅 Date picker change - start_date:', {
                      selected_value: selectedDate,
                      type: typeof selectedDate,
                      length: selectedDate.length,
                      matches_format: /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)
                    });
                    updateConfig({ start_date: selectedDate });
                  }}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>End Condition</Label>
                <RadioGroup
                  value={limitType}
                  onValueChange={(value: string) => setLimitType(value as 'end_date' | 'max_occurrences')}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="end_date" id="end_date_option" />
                    <Label htmlFor="end_date_option">End on specific date</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="max_occurrences" id="max_occurrences_option" />
                    <Label htmlFor="max_occurrences_option">After specific number of sends</Label>
                  </div>
                </RadioGroup>

                {limitType === 'end_date' && (
                  <Input
                    type="date"
                    value={config.end_date || ''}
                    min={config.start_date}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      console.log('📅 Date picker change - end_date:', {
                        selected_value: selectedDate,
                        type: typeof selectedDate,
                        length: selectedDate.length,
                        matches_format: /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)
                      });
                      updateConfig({ end_date: selectedDate });
                    }}
                    className="mt-2"
                  />
                )}

                {limitType === 'max_occurrences' && (
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="Number of sends"
                    value={config.max_occurrences || ''}
                    onChange={(e) => updateConfig({ max_occurrences: parseInt(e.target.value) || undefined })}
                    className="mt-2"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Time Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Time Settings</CardTitle>
              <CardDescription>When during the day should emails be sent?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="send_time">Send Time</Label>
                  <Input
                    id="send_time"
                    type="time"
                    value={config.time}
                    onChange={(e) => updateConfig({ time: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={config.timezone}
                    onValueChange={(value) => updateConfig({ timezone: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Advanced Options</CardTitle>
              <CardDescription>Additional scheduling preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="skip_weekends">Skip Weekends</Label>
                  <p className="text-sm text-gray-600">Don't send emails on Saturday or Sunday</p>
                </div>
                <Switch
                  id="skip_weekends"
                  checked={config.skip_weekends}
                  onCheckedChange={(checked) => updateConfig({ skip_weekends: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="skip_holidays">Skip Holidays</Label>
                  <p className="text-sm text-gray-600">Don't send emails on public holidays</p>
                </div>
                <Switch
                  id="skip_holidays"
                  checked={config.skip_holidays}
                  onCheckedChange={(checked) => updateConfig({ skip_holidays: checked })}
                />
              </div>

              {config.skip_holidays && (
                <div className="ml-4">
                  <Label htmlFor="holiday_region">Holiday Region</Label>
                  <Select
                    value={config.holiday_region}
                    onValueChange={(value) => updateConfig({ holiday_region: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {holidayRegions.map((region) => (
                        <SelectItem key={region.value} value={region.value}>
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" />
                    Schedule Preview
                  </CardTitle>
                  <CardDescription>Next upcoming sends</CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={validateConfiguration}
                  disabled={isValidating || !config.start_date || !config.time}
                  className="text-xs"
                >
                  {isValidating ? "Validating..." : "Validate"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isValidating && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                </div>
              )}

              {!isValidating && validationResult && (
                <div className="space-y-4">
                  {/* Validation Status */}
                  {validationResult.is_valid ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>Configuration is valid</AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        {validationResult.errors[0]?.message || 'Invalid configuration'}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Warnings */}
                  {validationResult.warnings.length > 0 && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        {validationResult.warnings.join('. ')}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Preview Dates */}
                  {validationResult.preview_dates.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Upcoming Sends:</h4>
                      <div className="space-y-2">
                        {formatPreviewDates(validationResult.preview_dates).map((date, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm"
                          >
                            <Timer className="w-3 h-3 text-gray-500" />
                            {date}
                          </div>
                        ))}
                      </div>
                      {validationResult.preview_dates.length > 5 && (
                        <p className="text-xs text-gray-600 mt-2">
                          And {validationResult.preview_dates.length - 5} more...
                        </p>
                      )}
                    </div>
                  )}

                  {/* RRULE */}
                  {validationResult.rrule && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-2">Generated RRULE:</h4>
                      <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                        {validationResult.rrule}
                      </code>
                    </div>
                  )}
                </div>
              )}

              {/* Validation Errors */}
              {!isValidating && validationResult && validationResult.errors.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-red-700">Issues to Fix:</h4>
                  {validationResult.errors.map((error, index) => (
                    <div
                      key={index}
                      className="text-sm text-red-600 bg-red-50 p-2 rounded"
                    >
                      <strong>{error.field}:</strong> {error.message}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
