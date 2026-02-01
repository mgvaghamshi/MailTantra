'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Zap, X } from 'lucide-react';
import { useSubscription, type SubscriptionPlan } from '@/contexts/subscription-context';
import { cn } from '@/lib/utils';

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFeature?: string;
  onUpgradeSuccess?: () => void;
}

export function UpgradeDialog({
  open,
  onOpenChange,
  currentFeature,
  onUpgradeSuccess
}: UpgradeDialogProps) {
  const {
    plan: currentPlan,
    availablePlans,
    upgrading,
    upgradePlan,
    getUpgradeMessage
  } = useSubscription();
  
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleUpgrade = async () => {
    if (!selectedPlan) return;
    
    const success = await upgradePlan(selectedPlan);
    if (success) {
      onUpgradeSuccess?.();
      onOpenChange(false);
    }
  };

  const getRecommendedPlan = (): string => {
    if (currentPlan?.name === 'free') return 'pro';
    if (currentPlan?.name === 'pro') return 'enterprise';
    return 'pro';
  };

  const formatPrice = (price: number, interval: string): string => {
    if (price === 0) return 'Free';
    return `$${price}/${interval}`;
  };

  const isCurrentPlan = (planName: string): boolean => {
    return currentPlan?.name === planName;
  };

  const canUpgradeTo = (planName: string): boolean => {
    if (!currentPlan) return planName !== 'free';
    
    const planOrder = { free: 0, pro: 1, enterprise: 2 };
    const currentOrder = planOrder[currentPlan.name as keyof typeof planOrder] || 0;
    const targetOrder = planOrder[planName as keyof typeof planOrder] || 0;
    
    return targetOrder > currentOrder;
  };

  const sortedPlans = availablePlans
    .filter(plan => canUpgradeTo(plan.name) || isCurrentPlan(plan.name))
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Upgrade Your Plan
          </DialogTitle>
          <DialogDescription>
            {currentFeature
              ? getUpgradeMessage(currentFeature)
              : 'Choose a plan that fits your needs and unlock powerful features.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-6">
          {sortedPlans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                You're already on the highest available plan!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isSelected={selectedPlan === plan.id}
                  isCurrent={isCurrentPlan(plan.name)}
                  isRecommended={plan.name === getRecommendedPlan()}
                  onSelect={() => setSelectedPlan(plan.id)}
                  canSelect={canUpgradeTo(plan.name)}
                />
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={upgrading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          
          {selectedPlan && (
            <Button
              onClick={handleUpgrade}
              disabled={upgrading || !selectedPlan}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {upgrading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Upgrading...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Upgrade Now
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface PlanCardProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  isCurrent: boolean;
  isRecommended: boolean;
  onSelect: () => void;
  canSelect: boolean;
}

function PlanCard({
  plan,
  isSelected,
  isCurrent,
  isRecommended,
  onSelect,
  canSelect
}: PlanCardProps) {
  return (
    <Card
      className={cn(
        "relative cursor-pointer transition-all duration-200 hover:shadow-lg",
        isSelected && "ring-2 ring-blue-500",
        isCurrent && "ring-2 ring-green-500",
        !canSelect && "opacity-60 cursor-not-allowed"
      )}
      onClick={canSelect ? onSelect : undefined}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-600 text-white">
            <Crown className="h-3 w-3 mr-1" />
            Recommended
          </Badge>
        </div>
      )}

      {isCurrent && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-green-600 text-white">Current Plan</Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl">{plan.display_name}</CardTitle>
        <div className="text-3xl font-bold">
          {plan.display_price}
        </div>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Limits */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Usage Limits</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Campaigns:</span>
              <span className="font-medium">
                {plan.limits.maxCampaigns === null || plan.limits.maxCampaigns === -1
                  ? 'Unlimited'
                  : plan.limits.maxCampaigns.toLocaleString()
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Emails:</span>
              <span className="font-medium">
                {plan.limits.maxMonthlyEmails === null || plan.limits.maxMonthlyEmails === -1
                  ? 'Unlimited'
                  : plan.limits.maxMonthlyEmails.toLocaleString()
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span>Recipients per Campaign:</span>
              <span className="font-medium">
                {plan.limits.maxRecipientsPerCampaign === null || plan.limits.maxRecipientsPerCampaign === -1
                  ? 'Unlimited'
                  : plan.limits.maxRecipientsPerCampaign.toLocaleString()
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span>Templates:</span>
              <span className="font-medium">
                {plan.limits.maxTemplates === null || plan.limits.maxTemplates === -1
                  ? 'Unlimited'
                  : plan.limits.maxTemplates.toLocaleString()
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span>Contacts:</span>
              <span className="font-medium">
                {plan.limits.maxContacts === null || plan.limits.maxContacts === -1
                  ? 'Unlimited'
                  : plan.limits.maxContacts.toLocaleString()
                }
              </span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Features</h4>
          <div className="space-y-1">
            {plan.features.slice(0, 6).map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                <span className="capitalize">
                  {feature.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
            {plan.features.length > 6 && (
              <div className="text-xs text-muted-foreground">
                +{plan.features.length - 6} more features
              </div>
            )}
          </div>
        </div>

        {canSelect && !isCurrent && (
          <Button
            className={cn(
              "w-full",
              isSelected
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600 hover:bg-gray-700"
            )}
            onClick={onSelect}
          >
            {isSelected ? 'Selected' : 'Select Plan'}
          </Button>
        )}

        {isCurrent && (
          <Button className="w-full" variant="outline" disabled>
            Current Plan
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
