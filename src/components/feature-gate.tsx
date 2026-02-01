'use client';

import React, { useState, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Zap, ArrowRight } from 'lucide-react';
import { useSubscription } from '@/contexts/subscription-context';
import { UpgradeDialog } from './upgrade-dialog';
import { cn } from '@/lib/utils';

interface FeatureGateProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
  requirePro?: boolean;
  requireEnterprise?: boolean;
  className?: string;
}

export function FeatureGate({
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
  requirePro = false,
  requireEnterprise = false,
  className
}: FeatureGateProps) {
  const { hasFeature, isPro, isEnterprise } = useSubscription();
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  // Check tier requirements
  if (requireEnterprise && !isEnterprise()) {
    return fallback || (
      showUpgradePrompt ? (
        <>
          <FeatureUpgradePrompt
            feature={feature}
            requiredTier="Enterprise"
            onUpgrade={() => setUpgradeDialogOpen(true)}
            className={className}
          />
          <UpgradeDialog
            open={upgradeDialogOpen}
            onOpenChange={setUpgradeDialogOpen}
            currentFeature={feature}
          />
        </>
      ) : null
    );
  }

  if (requirePro && !isPro()) {
    return fallback || (
      showUpgradePrompt ? (
        <>
          <FeatureUpgradePrompt
            feature={feature}
            requiredTier="Pro"
            onUpgrade={() => setUpgradeDialogOpen(true)}
            className={className}
          />
          <UpgradeDialog
            open={upgradeDialogOpen}
            onOpenChange={setUpgradeDialogOpen}
            currentFeature={feature}
          />
        </>
      ) : null
    );
  }

  // Check specific feature access
  if (!hasFeature(feature)) {
    return fallback || (
      showUpgradePrompt ? (
        <>
          <FeatureUpgradePrompt
            feature={feature}
            onUpgrade={() => setUpgradeDialogOpen(true)}
            className={className}
          />
          <UpgradeDialog
            open={upgradeDialogOpen}
            onOpenChange={setUpgradeDialogOpen}
            currentFeature={feature}
          />
        </>
      ) : null
    );
  }

  return <>{children}</>;
}

interface FeatureUpgradePromptProps {
  feature: string;
  requiredTier?: string;
  onUpgrade: () => void;
  className?: string;
  compact?: boolean;
}

function FeatureUpgradePrompt({
  feature,
  requiredTier,
  onUpgrade,
  className,
  compact = false
}: FeatureUpgradePromptProps) {
  const { getUpgradeMessage, isFree } = useSubscription();

  const getFeatureDisplayName = (feature: string): string => {
    const names: Record<string, string> = {
      'campaign_scheduling': 'Campaign Scheduling',
      'ab_testing': 'A/B Testing',
      'segmentation': 'Contact Segmentation',
      'advanced_analytics': 'Advanced Analytics',
      'ai_content_generation': 'AI Content Generation',
      'team_collaboration': 'Team Collaboration',
      'pro_templates': 'Professional Templates',
      'automation': 'Email Automation',
      'custom_domains': 'Custom Domains',
      'white_label': 'White Label',
      'api_access': 'API Access',
      'priority_support': 'Priority Support',
      'advanced_reporting': 'Advanced Reporting',
      'bulk_operations': 'Bulk Operations'
    };
    
    return names[feature] || feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getFeatureDescription = (feature: string): string => {
    const descriptions: Record<string, string> = {
      'campaign_scheduling': 'Schedule your campaigns to send at the optimal time for better engagement.',
      'ab_testing': 'Test different versions of your campaigns to optimize performance.',
      'segmentation': 'Target specific groups of contacts with personalized campaigns.',
      'advanced_analytics': 'Get detailed insights with heat maps, conversion tracking, and more.',
      'ai_content_generation': 'Generate compelling email content using AI technology.',
      'team_collaboration': 'Work together with your team on campaigns and templates.',
      'pro_templates': 'Access our library of professionally designed email templates.',
      'automation': 'Set up automated email sequences and drip campaigns.',
      'custom_domains': 'Use your own domain for email sending and tracking.',
      'white_label': 'Remove our branding and use your own.',
      'api_access': 'Integrate with your existing tools using our REST API.',
      'priority_support': 'Get faster response times and dedicated support.',
      'advanced_reporting': 'Export detailed reports and integrate with your analytics tools.',
      'bulk_operations': 'Perform actions on multiple campaigns and contacts at once.'
    };
    
    return descriptions[feature] || 'Unlock this premium feature to enhance your email marketing.';
  };

  const getRequiredTierBadge = () => {
    if (requiredTier) {
      return (
        <Badge variant="secondary" className="mb-2">
          {requiredTier} Feature
        </Badge>
      );
    }

    // Determine tier based on feature
    const enterpriseFeatures = [
      'ai_content_generation',
      'team_collaboration',
      'white_label',
      'custom_domains',
      'priority_support'
    ];

    if (enterpriseFeatures.includes(feature)) {
      return (
        <Badge variant="secondary" className="mb-2">
          <Crown className="h-3 w-3 mr-1" />
          Enterprise Feature
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="mb-2">
        <Zap className="h-3 w-3 mr-1" />
        Pro Feature
      </Badge>
    );
  };

  if (compact) {
    return (
      <div className={cn(
        "flex items-center justify-between p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50",
        className
      )}>
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">
              {getFeatureDisplayName(feature)}
            </p>
            <p className="text-sm text-gray-600">
              {requiredTier ? `Requires ${requiredTier} plan` : 'Premium feature'}
            </p>
          </div>
        </div>
        <Button
          onClick={onUpgrade}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Crown className="h-3 w-3 mr-1" />
          Upgrade
        </Button>
      </div>
    );
  }

  return (
    <Card className={cn("text-center border-dashed", className)}>
      <CardHeader className="pb-4">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Lock className="h-6 w-6 text-blue-600" />
        </div>
        
        {getRequiredTierBadge()}
        
        <CardTitle className="text-xl">
          {getFeatureDisplayName(feature)}
        </CardTitle>
        
        <CardDescription className="text-base">
          {getFeatureDescription(feature)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {getUpgradeMessage(feature)}
          </p>
          
          <Button
            onClick={onUpgrade}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Crown className="h-4 w-4 mr-2" />
            {isFree() ? 'Upgrade to Pro' : 'Upgrade Plan'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Inline feature gate for wrapping individual UI elements
interface InlineFeatureGateProps {
  feature: string;
  children: ReactNode;
  disabled?: boolean;
  requirePro?: boolean;
  requireEnterprise?: boolean;
  onClick?: () => void;
}

export function InlineFeatureGate({
  feature,
  children,
  disabled = false,
  requirePro = false,
  requireEnterprise = false,
  onClick
}: InlineFeatureGateProps) {
  const { hasFeature, isPro, isEnterprise } = useSubscription();
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  const hasAccess = () => {
    if (requireEnterprise && !isEnterprise()) return false;
    if (requirePro && !isPro()) return false;
    return hasFeature(feature);
  };

  const handleClick = () => {
    if (hasAccess()) {
      onClick?.();
    } else {
      setUpgradeDialogOpen(true);
    }
  };

  return (
    <>
      <div
        className={cn(
          !hasAccess() && "relative cursor-pointer opacity-60 hover:opacity-80"
        )}
        onClick={!hasAccess() ? handleClick : undefined}
      >
        {children}
        
        {!hasAccess() && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded">
            <Lock className="h-4 w-4 text-gray-600" />
          </div>
        )}
      </div>
      
      <UpgradeDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
        currentFeature={feature}
      />
    </>
  );
}
