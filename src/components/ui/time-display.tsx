/**
 * Reusable time display components with auto-update capabilities
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useRelativeTime, useTimeInfo, useConditionalTimeDisplay } from '@/hooks/use-time';
import { getTimeStatus, TimeFormatOptions } from '@/lib/time-utils';

export interface TimeDisplayProps {
  /** Timestamp to display */
  timestamp: string | Date | null | undefined;
  /** CSS class name */
  className?: string;
  /** Display format options */
  format?: TimeFormatOptions;
  /** Update interval in milliseconds */
  updateInterval?: number;
  /** Show tooltip with full timestamp */
  showTooltip?: boolean;
}

/**
 * Basic relative time display with auto-updates
 */
export function RelativeTime({ 
  timestamp, 
  className, 
  format = {}, 
  updateInterval = 60000,
  showTooltip = true 
}: TimeDisplayProps) {
  const relativeTime = useRelativeTime(timestamp, { ...format, updateInterval });
  const timeInfo = useTimeInfo(timestamp);
  
  const element = (
    <span className={cn('text-sm text-muted-foreground', className)}>
      {relativeTime}
    </span>
  );
  
  if (showTooltip && timeInfo) {
    return (
      <span title={`${timeInfo.absolute} (${timeInfo.iso})`}>
        {element}
      </span>
    );
  }
  
  return element;
}

/**
 * Smart time display that switches between relative and absolute
 */
export function SmartTime({ 
  timestamp, 
  className, 
  format = {}, 
  updateInterval = 60000,
  showTooltip = true 
}: TimeDisplayProps & { thresholdDays?: number }) {
  const { display, isRelative } = useConditionalTimeDisplay(timestamp, 7);
  const timeInfo = useTimeInfo(timestamp, { ...format, updateInterval });
  
  const element = (
    <span className={cn(
      'text-sm',
      isRelative ? 'text-muted-foreground' : 'text-foreground',
      className
    )}>
      {display}
    </span>
  );
  
  if (showTooltip && timeInfo) {
    return (
      <span title={`${timeInfo.absolute} (${timeInfo.iso})`}>
        {element}
      </span>
    );
  }
  
  return element;
}

/**
 * Time display with status indicator
 */
export function StatusTime({ 
  timestamp, 
  className, 
  format = {}, 
  updateInterval = 60000,
  showTooltip = true 
}: TimeDisplayProps) {
  const relativeTime = useRelativeTime(timestamp, { ...format, updateInterval });
  const timeInfo = useTimeInfo(timestamp);
  const status = getTimeStatus(timestamp);
  
  const getStatusColor = () => {
    switch (status) {
      case 'recent': return 'text-green-600 dark:text-green-400';
      case 'moderate': return 'text-yellow-600 dark:text-yellow-400';
      case 'old': return 'text-gray-600 dark:text-gray-400';
      case 'future': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-red-600 dark:text-red-400';
    }
  };
  
  const getStatusIndicator = () => {
    switch (status) {
      case 'recent': return '●';
      case 'moderate': return '●';
      case 'old': return '○';
      case 'future': return '◐';
      default: return '!';
    }
  };
  
  const element = (
    <span className={cn('flex items-center gap-1 text-sm', className)}>
      <span className={cn('text-xs', getStatusColor())}>
        {getStatusIndicator()}
      </span>
      <span className="text-muted-foreground">
        {relativeTime}
      </span>
    </span>
  );
  
  if (showTooltip && timeInfo) {
    return (
      <span title={`${timeInfo.absolute} (${timeInfo.iso})`}>
        {element}
      </span>
    );
  }
  
  return element;
}

/**
 * Compact time display for table cells
 */
export function CompactTime({ 
  timestamp, 
  className, 
  format = { addSuffix: false }, 
  updateInterval = 60000,
  showTooltip = true 
}: TimeDisplayProps) {
  const relativeTime = useRelativeTime(timestamp, { ...format, updateInterval });
  const timeInfo = useTimeInfo(timestamp);
  
  const element = (
    <span className={cn('text-xs text-muted-foreground font-mono', className)}>
      {relativeTime}
    </span>
  );
  
  if (showTooltip && timeInfo) {
    return (
      <span title={`${timeInfo.absolute} (${timeInfo.iso})`}>
        {element}
      </span>
    );
  }
  
  return element;
}

/**
 * Detailed time display with both relative and absolute
 */
export function DetailedTime({ 
  timestamp, 
  className, 
  format = {}, 
  updateInterval = 60000 
}: TimeDisplayProps) {
  const timeInfo = useTimeInfo(timestamp, { ...format, updateInterval });
  
  if (!timeInfo) {
    return (
      <span className={cn('text-sm text-muted-foreground', className)}>
        Unknown time
      </span>
    );
  }
  
  return (
    <div className={cn('space-y-1', className)}>
      <div className="text-sm font-medium">
        {timeInfo.relative}
      </div>
      <div className="text-xs text-muted-foreground">
        {timeInfo.absolute}
      </div>
    </div>
  );
}

/**
 * Session activity time display
 */
export function SessionTime({ 
  timestamp, 
  className, 
  updateInterval = 30000 
}: Omit<TimeDisplayProps, 'format'>) {
  const timeInfo = useTimeInfo(timestamp, { updateInterval });
  
  if (!timeInfo) {
    return (
      <span className={cn('text-sm text-muted-foreground', className)}>
        Unknown
      </span>
    );
  }
  
  const display = timeInfo.isToday 
    ? timeInfo.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : timeInfo.relative;
  
  return (
    <span 
      className={cn('text-sm text-muted-foreground', className)}
      title={`${timeInfo.absolute} (${timeInfo.iso})`}
    >
      {display}
    </span>
  );
}

/**
 * Audit log time display
 */
export function AuditTime({ 
  timestamp, 
  className, 
  updateInterval = 60000 
}: Omit<TimeDisplayProps, 'format'>) {
  const timeInfo = useTimeInfo(timestamp, { updateInterval });
  
  if (!timeInfo) {
    return (
      <span className={cn('text-sm text-muted-foreground', className)}>
        Unknown time
      </span>
    );
  }
  
  return (
    <div className={cn('space-y-1', className)}>
      <div className="text-sm text-muted-foreground">
        {timeInfo.relative}
      </div>
      <div className="text-xs text-muted-foreground font-mono">
        {timeInfo.date.toLocaleDateString()} {timeInfo.date.toLocaleTimeString()}
      </div>
    </div>
  );
}

/**
 * Time range display (duration between two timestamps)
 */
export interface TimeRangeProps {
  startTime: string | Date | null | undefined;
  endTime: string | Date | null | undefined;
  className?: string;
  showTooltip?: boolean;
}

export function TimeRange({ 
  startTime, 
  endTime, 
  className, 
  showTooltip = true 
}: TimeRangeProps) {
  const startInfo = useTimeInfo(startTime);
  const endInfo = useTimeInfo(endTime);
  
  if (!startInfo || !endInfo) {
    return (
      <span className={cn('text-sm text-muted-foreground', className)}>
        Unknown duration
      </span>
    );
  }
  
  const diffMs = Math.abs(endInfo.date.getTime() - startInfo.date.getTime());
  const duration = formatDuration(diffMs);
  
  const element = (
    <span className={cn('text-sm text-muted-foreground', className)}>
      {duration}
    </span>
  );
  
  if (showTooltip) {
    return (
      <span title={`From ${startInfo.absolute} to ${endInfo.absolute}`}>
        {element}
      </span>
    );
  }
  
  return element;
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
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
