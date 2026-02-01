/**
 * React hooks for time formatting with auto-update capabilities
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  formatRelativeTime, 
  getTimeInfo, 
  TimeFormatOptions, 
  FormattedTime 
} from '@/lib/time-utils';

/**
 * Hook for auto-updating relative time display
 */
export function useRelativeTime(
  timestamp: string | Date | null | undefined,
  options: TimeFormatOptions & { updateInterval?: number } = {}
): string {
  const { updateInterval = 60000, ...timeOptions } = options;
  const [relativeTime, setRelativeTime] = useState(() => 
    formatRelativeTime(timestamp, timeOptions)
  );
  
  const timestampRef = useRef(timestamp);
  timestampRef.current = timestamp;
  
  useEffect(() => {
    // Update immediately when timestamp changes
    setRelativeTime(formatRelativeTime(timestampRef.current, timeOptions));
    
    // Set up interval for updates
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(timestampRef.current, timeOptions));
    }, updateInterval);
    
    return () => clearInterval(interval);
  }, [timestamp, updateInterval, JSON.stringify(timeOptions)]);
  
  return relativeTime;
}

/**
 * Hook for comprehensive time information with auto-updates
 */
export function useTimeInfo(
  timestamp: string | Date | null | undefined,
  options: TimeFormatOptions & { updateInterval?: number } = {}
): FormattedTime | null {
  const { updateInterval = 60000, ...timeOptions } = options;
  const [timeInfo, setTimeInfo] = useState<FormattedTime | null>(() => 
    getTimeInfo(timestamp, timeOptions)
  );
  
  const timestampRef = useRef(timestamp);
  timestampRef.current = timestamp;
  
  useEffect(() => {
    // Update immediately when timestamp changes
    setTimeInfo(getTimeInfo(timestampRef.current, timeOptions));
    
    // Set up interval for updates
    const interval = setInterval(() => {
      setTimeInfo(getTimeInfo(timestampRef.current, timeOptions));
    }, updateInterval);
    
    return () => clearInterval(interval);
  }, [timestamp, updateInterval, JSON.stringify(timeOptions)]);
  
  return timeInfo;
}

/**
 * Hook for batch time updates (efficient for multiple timestamps)
 */
export function useBatchTimeUpdates<T extends Record<string, any>>(
  items: T[],
  timestampKey: keyof T,
  options: TimeFormatOptions & { updateInterval?: number } = {}
): (T & { _relativeTime: string })[] {
  const { updateInterval = 60000, ...timeOptions } = options;
  const [updateTrigger, setUpdateTrigger] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTrigger(prev => prev + 1);
    }, updateInterval);
    
    return () => clearInterval(interval);
  }, [updateInterval]);
  
  return useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateTrigger; // Trigger recalculation
    
    return items.map(item => ({
      ...item,
      _relativeTime: formatRelativeTime(item[timestampKey] as string, timeOptions)
    }));
  }, [items, timestampKey, timeOptions, updateTrigger]);
}

/**
 * Hook for smart update intervals based on time age
 */
export function useSmartTimeUpdates(
  timestamp: string | Date | null | undefined,
  options: TimeFormatOptions = {}
): string {
  const [relativeTime, setRelativeTime] = useState(() => 
    formatRelativeTime(timestamp, options)
  );
  
  const timestampRef = useRef(timestamp);
  timestampRef.current = timestamp;
  
  useEffect(() => {
    const updateTime = () => {
      setRelativeTime(formatRelativeTime(timestampRef.current, options));
    };
    
    const getUpdateInterval = () => {
      const timeInfo = getTimeInfo(timestampRef.current);
      if (!timeInfo) return 60000; // 1 minute default
      
      const now = new Date();
      const diffMs = Math.abs(now.getTime() - timeInfo.date.getTime());
      const diffMinutes = diffMs / (1000 * 60);
      
      // Smart intervals based on age
      if (diffMinutes < 1) return 5000;    // 5 seconds for very recent
      if (diffMinutes < 60) return 30000;  // 30 seconds for last hour
      if (diffMinutes < 1440) return 60000; // 1 minute for last day
      return 300000; // 5 minutes for older
    };
    
    updateTime(); // Initial update
    
    let interval: NodeJS.Timeout;
    const setupInterval = () => {
      const intervalMs = getUpdateInterval();
      interval = setInterval(() => {
        updateTime();
        // Recalculate interval in case time age category changed
        clearInterval(interval);
        setupInterval();
      }, intervalMs);
    };
    
    setupInterval();
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timestamp, JSON.stringify(options)]);
  
  return relativeTime;
}

/**
 * Hook for conditional time display (show relative vs absolute based on age)
 */
export function useConditionalTimeDisplay(
  timestamp: string | Date | null | undefined,
  thresholdDays: number = 7
): { display: string; isRelative: boolean } {
  const timeInfo = useTimeInfo(timestamp, { updateInterval: 60000 });
  
  return useMemo(() => {
    if (!timeInfo) {
      return { display: 'Unknown time', isRelative: false };
    }
    
    const now = new Date();
    const diffMs = Math.abs(now.getTime() - timeInfo.date.getTime());
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    
    if (diffDays > thresholdDays) {
      return { display: timeInfo.absolute, isRelative: false };
    } else {
      return { display: timeInfo.relative, isRelative: true };
    }
  }, [timeInfo, thresholdDays]);
}
