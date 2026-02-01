'use client';

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Crown, Zap } from 'lucide-react';
import { useSubscription } from '@/contexts/subscription-context';
import { cn } from '@/lib/utils';

interface CampaignUsageWarningProps {
  currentCampaignCount: number;
  className?: string;
}

export function CampaignUsageWarning({
  currentCampaignCount,
  className
}: CampaignUsageWarningProps) {
  const { plan, isFree, isPro, isEnterprise, usage } = useSubscription();

  const getCampaignLimit = () => {
    if (!plan?.limits?.maxCampaigns || plan.limits.maxCampaigns === -1) return -1; // Unlimited
    return plan.limits.maxCampaigns;
  };

  const campaignLimit = getCampaignLimit();
  const usagePercentage = usage?.campaigns?.percentage || 0;
  const remainingCampaigns = campaignLimit === -1 ? Infinity : Math.max(0, campaignLimit - currentCampaignCount);

  // Don't show warnings for unlimited plans
  if (campaignLimit === -1 || usagePercentage < 80) {
    return null;
  }

  const getWarningLevel = () => {
    if (usagePercentage >= 100) return 'danger';
    if (usagePercentage >= 90) return 'critical';
    return 'warning';
  };

  const getWarningMessage = () => {
    const level = getWarningLevel();
    
    if (level === 'danger') {
      return {
        title: 'Campaign limit reached',
        message: `You've reached your limit of ${campaignLimit} campaigns. Upgrade to create more campaigns.`,
        icon: <AlertTriangle className="h-4 w-4" />,
        variant: 'destructive' as const
      };
    }
    
    if (level === 'critical') {
      return {
        title: 'Approaching campaign limit',
        message: `You have ${remainingCampaigns} campaigns remaining out of ${campaignLimit}.`,
        icon: <AlertTriangle className="h-4 w-4" />,
        variant: 'destructive' as const
      };
    }
    
    return {
      title: 'Campaign usage notice',
      message: `You have ${remainingCampaigns} campaigns remaining out of ${campaignLimit}.`,
      icon: <AlertTriangle className="h-4 w-4" />,
      variant: 'default' as const
    };
  };

  const warning = getWarningMessage();
  const shouldShowUpgrade = usagePercentage >= 90;

  return (
    <Alert variant={warning.variant} className={cn("mb-6", className)}>
      {warning.icon}
      <AlertDescription className="flex items-center justify-between">
        <div>
          <p className="font-medium">{warning.title}</p>
          <p className="text-sm mt-1">{warning.message}</p>
        </div>
        
        {shouldShowUpgrade && (
          <div className="flex items-center gap-2 ml-4">
            {isFree() && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Zap className="h-3 w-3 mr-1" />
                Pro: 50 campaigns
              </Badge>
            )}
            {(isFree() || isPro()) && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Crown className="h-3 w-3 mr-1" />
                Enterprise: 1000 campaigns
              </Badge>
            )}
            <Button size="sm" className="ml-2">
              Upgrade Plan
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}

// Usage progress bar component
interface CampaignUsageProgressProps {
  currentCount: number;
  className?: string;
}

export function CampaignUsageProgress({
  currentCount,
  className
}: CampaignUsageProgressProps) {
  const { plan, usage } = useSubscription();
  
  const getCampaignLimit = () => {
    if (!plan?.limits?.maxCampaigns || plan.limits.maxCampaigns === -1) return -1; // Unlimited
    return plan.limits.maxCampaigns;
  };

  const limit = getCampaignLimit();
  const percentage = usage?.campaigns?.percentage || 0;
  const remaining = limit === -1 ? Infinity : Math.max(0, limit - currentCount);

  // Don't show progress for unlimited plans
  if (limit === -1) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Campaign usage</span>
          <span className="font-medium">
            {currentCount} campaigns (unlimited)
          </span>
        </div>
      </div>
    );
  }

  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 90) return 'bg-orange-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Campaign usage</span>
        <span className="font-medium">
          {currentCount} / {limit} campaigns
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn("h-2 rounded-full transition-all duration-300", getProgressColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {remaining <= 5 && remaining > 0 && (
        <p className="text-xs text-orange-600">
          {remaining} campaigns remaining
        </p>
      )}
      
      {percentage >= 100 && (
        <p className="text-xs text-red-600">
          Campaign limit reached
        </p>
      )}
    </div>
  );
}
