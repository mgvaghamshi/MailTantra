'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SubscriptionPlan {
  id: string;
  name: string;
  display_name: string;
  description: string;
  price: number;
  billing_interval: string;
  display_price: string;
  is_popular?: boolean;
  features: string[];
  limits: {
    maxCampaigns: number | null;
    maxRecipientsPerCampaign: number | null;
    maxMonthlyEmails: number | null;
    maxTemplates: number | null;
    maxContacts: number | null;
  };
}

interface PlanSelectorProps {
  selectedPlan: string | null;
  onPlanSelect: (planId: string) => void;
  className?: string;
}

export function PlanSelector({ selectedPlan, onPlanSelect, className }: PlanSelectorProps) {
  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'free',
      display_name: 'Free',
      description: 'Perfect for getting started',
      price: 0,
      billing_interval: 'month',
      display_price: 'Free',
      features: [
        'Up to 3 campaigns',
        '100 recipients per campaign',
        '5 basic templates',
        'Basic analytics',
        'Email tracking'
      ],
      limits: {
        maxCampaigns: 3,
        maxRecipientsPerCampaign: 100,
        maxMonthlyEmails: 1000,
        maxTemplates: 5,
        maxContacts: 500
      }
    },
    {
      id: 'pro',
      name: 'pro',
      display_name: 'Pro',
      description: 'For growing businesses',
      price: 29,
      billing_interval: 'month',
      display_price: '$29/month',
      is_popular: true,
      features: [
        'Unlimited campaigns',
        '10,000 recipients per campaign',
        '50+ professional templates',
        'A/B testing',
        'Campaign scheduling',
        'Advanced analytics',
        'Contact segmentation'
      ],
      limits: {
        maxCampaigns: null,
        maxRecipientsPerCampaign: 10000,
        maxMonthlyEmails: 25000,
        maxTemplates: 50,
        maxContacts: 10000
      }
    },
    {
      id: 'enterprise',
      name: 'enterprise',
      display_name: 'Enterprise',
      description: 'For large organizations',
      price: 99,
      billing_interval: 'month',
      display_price: '$99/month',
      features: [
        'Unlimited everything',
        'AI content generation',
        'Team collaboration',
        'Priority support',
        'White-label branding',
        'Custom integrations',
        'Advanced automation'
      ],
      limits: {
        maxCampaigns: null,
        maxRecipientsPerCampaign: null,
        maxMonthlyEmails: 100000,
        maxTemplates: null,
        maxContacts: null
      }
    }
  ];

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'free':
        return <Star className="h-5 w-5 text-green-600" />;
      case 'pro':
        return <Zap className="h-5 w-5 text-blue-600" />;
      case 'enterprise':
        return <Crown className="h-5 w-5 text-purple-600" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case 'free':
        return 'border-green-200 hover:border-green-300';
      case 'pro':
        return 'border-blue-200 hover:border-blue-300';
      case 'enterprise':
        return 'border-purple-200 hover:border-purple-300';
      default:
        return 'border-gray-200 hover:border-gray-300';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Choose Your Plan</h3>
        <p className="text-white/70 text-sm">Select the plan that best fits your needs. You can upgrade or downgrade anytime.</p>
      </div>

      <div className="space-y-4">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "relative cursor-pointer transition-all duration-200 glass-card w-full",
              getPlanColor(plan.name),
              selectedPlan === plan.id
                ? "ring-2 ring-white/40 bg-white/20"
                : "hover:bg-white/15",
              plan.is_popular && "ring-2 ring-blue-400/60"
            )}
            onClick={() => onPlanSelect(plan.id)}
          >
            {plan.is_popular && (
              <Badge className="absolute -top-2 left-4 bg-blue-600 text-white text-xs px-2 py-1">
                Most Popular
              </Badge>
            )}
            
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10">
                    {getPlanIcon(plan.name)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-white text-lg">{plan.display_name}</CardTitle>
                      <div className="text-xl font-bold text-white">
                        {plan.display_price}
                      </div>
                    </div>
                    <CardDescription className="text-white/70 text-sm mt-1">
                      {plan.description}
                    </CardDescription>
                    
                    {/* Key features inline */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {plan.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="text-xs text-white/80 bg-white/10 px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                      {plan.features.length > 2 && (
                        <span className="text-xs text-white/60">
                          +{plan.features.length - 2} more features
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 transition-all duration-200",
                    selectedPlan === plan.id
                      ? "border-white bg-white"
                      : "border-white/40"
                  )}>
                    {selectedPlan === plan.id && (
                      <Check className="h-3 w-3 text-gray-900 m-0.5" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Expanded features when selected */}
              {selectedPlan === plan.id && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-white/90 text-sm font-medium mb-2">Included features:</p>
                  <div className="grid grid-cols-1 gap-1">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-white/80">
                        <Check className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-white/60 text-xs">
          All plans include email tracking, analytics, and 24/7 support. 
          {selectedPlan !== 'free' && ' Start with a free trial, cancel anytime.'}
        </p>
      </div>
    </div>
  );
}
