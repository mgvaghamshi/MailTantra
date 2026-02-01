'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, Star, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

interface PlanBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showUpgrade?: boolean;
}

export function PlanBadge({ 
  className, 
  size = 'sm', 
  showIcon = true, 
  showUpgrade = false 
}: PlanBadgeProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Badge variant="outline" className={cn("animate-pulse", className)}>
        <div className="w-12 h-3 bg-gray-300 rounded" />
      </Badge>
    );
  }

  const plan = user?.plan;
  const planName = plan?.plan_name || 'free';

  const getPlanConfig = () => {
    switch (planName) {
      case 'enterprise':
        return {
          name: plan?.plan_display_name || 'Enterprise',
          icon: Sparkles,
          color: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600',
          variant: 'default' as const
        };
      case 'pro':
        return {
          name: plan?.plan_display_name || 'Pro',
          icon: Crown,
          color: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-600',
          variant: 'default' as const
        };
      default:
        return {
          name: plan?.plan_display_name || 'Free',
          icon: Star,
          color: 'bg-gray-100 text-gray-700 border-gray-300',
          variant: 'outline' as const
        };
    }
  };

  const config = getPlanConfig();
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge 
        variant={config.variant}
        className={cn(
          config.color,
          sizeClasses[size],
          "font-medium transition-all duration-200"
        )}
      >
        {showIcon && (
          <IconComponent className={cn(iconSizes[size], "mr-1")} />
        )}
        {config.name}
        {plan?.is_trial && (
          <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">Trial</span>
        )}
      </Badge>
      
      {showUpgrade && planName === 'free' && (
        <Badge 
          variant="outline" 
          className="text-xs px-2 py-1 cursor-pointer hover:bg-blue-50 transition-colors"
          onClick={() => window.location.href = '/settings?tab=billing'}
        >
          Upgrade
        </Badge>
      )}
    </div>
  );
}

// Component to show plan with usage info
interface PlanInfoProps {
  className?: string;
  showUsage?: boolean;
}

export function PlanInfo({ className, showUsage = true }: PlanInfoProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={cn("animate-pulse space-y-2", className)}>
        <div className="h-4 bg-gray-300 rounded w-20" />
        {showUsage && <div className="h-3 bg-gray-200 rounded w-16" />}
      </div>
    );
  }

  if (!user?.plan) {
    return (
      <div className={className}>
        <PlanBadge showUpgrade />
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      <PlanBadge />
      
      {showUsage && (
        <div className="text-xs text-muted-foreground">
          {user.plan.plan_display_name} Plan
        </div>
      )}
    </div>
  );
}
