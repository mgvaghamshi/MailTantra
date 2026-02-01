'use client';

import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Crown, X } from 'lucide-react';
import { useSubscription, type CurrentUsage } from '@/contexts/subscription-context';
import { UpgradeDialog } from './upgrade-dialog';
import { cn } from '@/lib/utils';

interface UsageWarningProps {
  type: keyof CurrentUsage;
  className?: string;
  showOnlyAtLimit?: boolean;
  hideUpgradeButton?: boolean;
  customMessage?: string;
}

export function UsageWarning({
  type,
  className,
  showOnlyAtLimit = false,
  hideUpgradeButton = false,
  customMessage
}: UsageWarningProps) {
  const {
    usage,
    isApproachingLimit,
    hasReachedLimit,
    getUsagePercentage,
    isFree,
    plan
  } = useSubscription();

  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!usage?.[type] || dismissed) return null;

  const usageData = usage[type];
  const percentage = getUsagePercentage(type);
  const isAtLimit = hasReachedLimit(type);
  const isApproaching = isApproachingLimit(type);

  // Only show if at limit or approaching limit (unless showOnlyAtLimit is true)
  if (showOnlyAtLimit && !isAtLimit) return null;
  if (!showOnlyAtLimit && !isApproaching && !isAtLimit) return null;

  // Don't show for unlimited plans
  if (usageData.limit === null) return null;

  const getTypeDisplayName = (type: keyof CurrentUsage): string => {
    const names = {
      campaigns: 'campaigns',
      emails_this_month: 'emails this month',
      templates: 'templates',
      contacts: 'contacts'
    };
    return names[type] || type;
  };

  const getWarningMessage = (): string => {
    if (customMessage) return customMessage;
    
    const typeName = getTypeDisplayName(type);
    
    if (isAtLimit) {
      return `You've reached your ${typeName} limit (${usageData.used}/${usageData.limit}). Upgrade to continue.`;
    }
    
    if (percentage >= 90) {
      return `You're almost at your ${typeName} limit (${usageData.used}/${usageData.limit}).`;
    }
    
    return `You're approaching your ${typeName} limit (${usageData.used}/${usageData.limit}).`;
  };

  const getAlertVariant = () => {
    if (isAtLimit) return 'destructive';
    if (percentage >= 90) return 'default';
    return 'default';
  };

  const getProgressColor = () => {
    if (isAtLimit) return 'bg-red-500';
    if (percentage >= 90) return 'bg-orange-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <>
      <Alert
        className={cn(
          "relative",
          isAtLimit && "border-red-200 bg-red-50",
          percentage >= 90 && "border-orange-200 bg-orange-50",
          className
        )}
        variant={getAlertVariant()}
      >
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">{getWarningMessage()}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
              className="h-6 w-6 p-0 hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{usageData.used.toLocaleString()} used</span>
              <span>{usageData.limit?.toLocaleString()} limit</span>
            </div>
            <div className="relative">
              <Progress
                value={percentage}
                className="h-2"
              />
              <div
                className={cn(
                  "absolute top-0 left-0 h-2 rounded-full transition-all",
                  getProgressColor()
                )}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Upgrade button */}
          {!hideUpgradeButton && !isFree() && (
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                Current plan: {plan?.display_name}
              </div>
              <Button
                size="sm"
                onClick={() => setUpgradeDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Crown className="h-3 w-3 mr-1" />
                Upgrade Plan
              </Button>
            </div>
          )}

          {!hideUpgradeButton && isFree() && (
            <Button
              size="sm"
              onClick={() => setUpgradeDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              <Crown className="h-3 w-3 mr-1" />
              Upgrade to Pro
            </Button>
          )}
        </AlertDescription>
      </Alert>

      <UpgradeDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
        currentFeature={`${type}_limit`}
        onUpgradeSuccess={() => setDismissed(true)}
      />
    </>
  );
}

// Convenience component for showing usage warnings in a compact format
interface UsageIndicatorProps {
  type: keyof CurrentUsage;
  className?: string;
  showLabel?: boolean;
}

export function UsageIndicator({
  type,
  className,
  showLabel = true
}: UsageIndicatorProps) {
  const { usage, getUsagePercentage, hasReachedLimit } = useSubscription();

  if (!usage?.[type] || usage[type].limit === null) return null;

  const usageData = usage[type];
  const percentage = getUsagePercentage(type);
  const isAtLimit = hasReachedLimit(type);

  const getTypeDisplayName = (type: keyof CurrentUsage): string => {
    const names = {
      campaigns: 'Campaigns',
      emails_this_month: 'Emails',
      templates: 'Templates',
      contacts: 'Contacts'
    };
    return names[type] || type;
  };

  const getProgressColor = () => {
    if (isAtLimit) return 'bg-red-500';
    if (percentage >= 90) return 'bg-orange-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">
            {getTypeDisplayName(type)}
          </span>
          <span className={cn(
            "font-medium",
            isAtLimit && "text-red-600",
            percentage >= 90 && "text-orange-600"
          )}>
            {usageData.used.toLocaleString()}/{usageData.limit?.toLocaleString()}
          </span>
        </div>
      )}
      <div className="relative">
        <Progress
          value={percentage}
          className="h-1.5"
        />
        <div
          className={cn(
            "absolute top-0 left-0 h-1.5 rounded-full transition-all",
            getProgressColor()
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
