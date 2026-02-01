'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface PlanLimits {
  maxCampaigns: number | null;
  maxRecipientsPerCampaign: number | null;
  maxMonthlyEmails: number | null;
  maxTemplates: number | null;
  maxContacts: number | null;
}

export interface UsageStats {
  used: number;
  limit: number | null;
  percentage: number;
}

export interface CurrentUsage {
  campaigns: UsageStats;
  emails_this_month: UsageStats;
  templates: UsageStats;
  contacts: UsageStats;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  display_name: string;
  description: string;
  price: number;
  billing_interval: string;
  display_price: string;
  is_popular?: boolean;
  limits: PlanLimits;
  features: string[];
  sort_order: number;
}

export interface UserSubscription {
  id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  is_trial: boolean;
  days_until_renewal: number;
  cancel_at_period_end: boolean;
}

export interface UpgradeSuggestion {
  reason: string;
  message: string;
  recommended_plan: string;
}

export interface SubscriptionContextType {
  // Current subscription data
  subscription: UserSubscription | null;
  plan: SubscriptionPlan | null;
  usage: CurrentUsage | null;
  features: string[];
  upgradeSuggestions: UpgradeSuggestion[];
  
  // Available plans
  availablePlans: SubscriptionPlan[];
  
  // Loading states
  loading: boolean;
  upgrading: boolean;
  
  // Feature access methods
  hasFeature: (feature: string) => boolean;
  canCreateCampaign: () => boolean;
  canSendToRecipients: (count: number) => boolean;
  canSendEmails: (count: number) => boolean;
  canCreateTemplate: () => boolean;
  canAddContacts: (count: number) => boolean;
  
  // Tier checking methods
  isPro: () => boolean;
  isEnterprise: () => boolean;
  isFree: () => boolean;
  
  // Usage checking methods
  isApproachingLimit: (type: keyof CurrentUsage, threshold?: number) => boolean;
  hasReachedLimit: (type: keyof CurrentUsage) => boolean;
  getUsagePercentage: (type: keyof CurrentUsage) => number;
  
  // Actions
  refreshSubscription: () => Promise<void>;
  upgradePlan: (planId: string) => Promise<boolean>;
  getUpgradeMessage: (feature: string) => string;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [usage, setUsage] = useState<CurrentUsage | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [upgradeSuggestions, setUpgradeSuggestions] = useState<UpgradeSuggestion[]>([]);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  // Map backend feature names to frontend feature identifiers
  const mapBackendFeaturesToFrontend = useCallback((backendFeatures: string[], planName?: string): string[] => {
    const featureMapping: Record<string, string[]> = {
      // Backend feature name -> Frontend feature keys
      'Basic templates': ['basic_templates'],
      'Email tracking': ['email_tracking'],
      'Campaign analytics': ['basic_analytics'],
      'Contact management': ['contact_management'],
      'All Free features': ['basic_templates', 'email_tracking', 'basic_analytics', 'contact_management'],
      'A/B testing': ['ab_testing'],
      'Advanced analytics': ['advanced_analytics'],
      'Custom templates': ['pro_templates'],
      'Priority support': ['priority_support'],
      'Advanced segmentation': ['segmentation'],
      'All Pro features': ['basic_templates', 'email_tracking', 'basic_analytics', 'contact_management', 'ab_testing', 'advanced_analytics', 'pro_templates', 'priority_support', 'segmentation'],
      'Unlimited everything': ['unlimited_campaigns', 'unlimited_contacts', 'unlimited_emails'],
      'API access': ['api_access'],
      'Custom integrations': ['custom_integrations'],
      'Dedicated support': ['dedicated_support'],
      'White labeling': ['white_label'],
      'Team collaboration': ['team_collaboration']
    };

    // Add plan-based features
    const planFeatures: Record<string, string[]> = {
      'free': ['campaign_create', 'campaign_edit', 'campaign_send'],
      'pro': ['campaign_create', 'campaign_edit', 'campaign_send', 'campaign_scheduling'],
      'enterprise': ['campaign_create', 'campaign_edit', 'campaign_send', 'campaign_scheduling', 'recurring_campaigns', 'ai_content_generation']
    };

    let mappedFeatures: string[] = [];

    // Map backend features to frontend keys
    backendFeatures.forEach(backendFeature => {
      const frontendKeys = featureMapping[backendFeature] || [];
      mappedFeatures.push(...frontendKeys);
    });

    // Add plan-specific features
    if (planName && planFeatures[planName]) {
      mappedFeatures.push(...planFeatures[planName]);
    }

    // Remove duplicates
    return [...new Set(mappedFeatures)];
  }, []);

  const loadSubscriptionData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated before making API calls
      if (!apiClient.isAuthenticated()) {
        console.log('User not authenticated, setting default free plan');
        // Set default free tier
        const defaultPlan: SubscriptionPlan = {
          id: 'free',
          name: 'free',
          display_name: 'Free',
          description: 'Free tier with basic features',
          price: 0,
          billing_interval: 'monthly',
          display_price: '$0/month',
          limits: {
            maxCampaigns: 5,
            maxMonthlyEmails: 1000,
            maxContacts: 500,
            maxTemplates: 5,
            maxRecipientsPerCampaign: 100
          },
          features: [
            'campaign_create',
            'campaign_edit',
            'campaign_send',
            'basic_analytics',
            'contact_management',
            'basic_templates',
            'email_tracking'
          ],
          sort_order: 1
        };

        const defaultUsage: CurrentUsage = {
          campaigns: { used: 0, limit: 5, percentage: 0 },
          emails_this_month: { used: 0, limit: 1000, percentage: 0 },
          contacts: { used: 0, limit: 500, percentage: 0 },
          templates: { used: 0, limit: 5, percentage: 0 }
        };

        setPlan(defaultPlan);
        setUsage(defaultUsage);
        setFeatures(defaultPlan.features);
        setUpgradeSuggestions([]);
        setAvailablePlans([defaultPlan]);
        return;
      }
      
      // Load current subscription
      const currentResponse = await apiClient.get('/api/v1/subscription/current');
      if (currentResponse.data) {
        setSubscription(currentResponse.data.subscription);
        setPlan(currentResponse.data.plan);
        setUsage(currentResponse.data.usage);
        
        // Map backend feature names to frontend feature keys
        const backendFeatures = currentResponse.data.features || [];
        const mappedFeatures = mapBackendFeaturesToFrontend(backendFeatures, currentResponse.data.plan?.name);
        
        console.log("🔍 Subscription Context - Feature Mapping:", {
          planName: currentResponse.data.plan?.name,
          backendFeatures,
          mappedFeatures,
          hasScheduling: mappedFeatures.includes("campaign_scheduling"),
          hasRecurring: mappedFeatures.includes("recurring_campaigns")
        });
        
        setFeatures(mappedFeatures);
        setUpgradeSuggestions(currentResponse.data.upgrade_suggestions || []);
      }
      
      // Load available plans
      const plansResponse = await apiClient.get('/api/v1/subscription/plans');
      if (plansResponse.data) {
        setAvailablePlans(plansResponse.data.plans || []);
      }
    } catch (error) {
      console.error('Failed to load subscription data:', error);
      
      // Set default free tier if API fails
      const defaultPlan: SubscriptionPlan = {
        id: 'free',
        name: 'free',
        display_name: 'Free',
        description: 'Free tier with basic features',
        price: 0,
        billing_interval: 'monthly',
        display_price: '$0/month',
        limits: {
          maxCampaigns: 5,
          maxMonthlyEmails: 1000,
          maxContacts: 500,
          maxTemplates: 5,
          maxRecipientsPerCampaign: 100
        },
        features: [
          'campaign_create',
          'campaign_edit',
          'campaign_send',
          'basic_analytics',
          'contact_management',
          'basic_templates',
          'email_tracking'
        ],
        sort_order: 1
      };

      const defaultUsage: CurrentUsage = {
        campaigns: { used: 0, limit: 5, percentage: 0 },
        emails_this_month: { used: 0, limit: 1000, percentage: 0 },
        contacts: { used: 0, limit: 500, percentage: 0 },
        templates: { used: 0, limit: 5, percentage: 0 }
      };

      setPlan(defaultPlan);
      setUsage(defaultUsage);
      setFeatures(defaultPlan.features);
      setUpgradeSuggestions([]);
      setAvailablePlans([defaultPlan]);
    } finally {
      setLoading(false);
    }
  }, [mapBackendFeaturesToFrontend]);

  useEffect(() => {
    let mounted = true;

    const initializeSubscription = async () => {
      if (mounted) {
        await loadSubscriptionData();
      }
    };

    initializeSubscription();
    
    // Listen for user login events to refresh subscription data
    const handleUserLogin = () => {
      if (mounted) {
        loadSubscriptionData();
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('user-logged-in', handleUserLogin);
      
      return () => {
        mounted = false;
        window.removeEventListener('user-logged-in', handleUserLogin);
      };
    }

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array to only run once

  // Feature access methods
  const hasFeature = (feature: string): boolean => {
    return features.includes(feature);
  };

  const canCreateCampaign = (): boolean => {
    if (!usage?.campaigns || usage.campaigns.limit === null || usage.campaigns.limit === -1) return true;
    return usage.campaigns.used < usage.campaigns.limit;
  };

  const canSendToRecipients = (count: number): boolean => {
    // Add null safety for both plan and limits
    if (!plan || !plan.limits || !plan.limits.maxRecipientsPerCampaign || plan.limits.maxRecipientsPerCampaign === -1) return true;
    return count <= plan.limits.maxRecipientsPerCampaign;
  };

  const canSendEmails = (count: number): boolean => {
    if (!usage?.emails_this_month || usage.emails_this_month.limit === null || usage.emails_this_month.limit === -1) return true;
    return (usage.emails_this_month.used + count) <= usage.emails_this_month.limit;
  };

  const canCreateTemplate = (): boolean => {
    if (!usage?.templates || usage.templates.limit === null || usage.templates.limit === -1) return true;
    return usage.templates.used < usage.templates.limit;
  };

  const canAddContacts = (count: number): boolean => {
    if (!usage?.contacts || usage.contacts.limit === null || usage.contacts.limit === -1) return true;
    return (usage.contacts.used + count) <= usage.contacts.limit;
  };

  // Tier checking methods
  const isPro = (): boolean => {
    return plan?.name === 'pro' || plan?.name === 'enterprise';
  };

  const isEnterprise = (): boolean => {
    return plan?.name === 'enterprise';
  };

  const isFree = (): boolean => {
    return plan?.name === 'free' || !plan;
  };

  // Usage checking methods
  const isApproachingLimit = (type: keyof CurrentUsage, threshold: number = 80): boolean => {
    if (!usage?.[type] || usage[type].limit === null || usage[type].limit === -1) return false;
    return usage[type].percentage >= threshold;
  };

  const hasReachedLimit = (type: keyof CurrentUsage): boolean => {
    if (!usage?.[type] || usage[type].limit === null || usage[type].limit === -1) return false;
    return usage[type].used >= usage[type].limit!;
  };

  const getUsagePercentage = (type: keyof CurrentUsage): number => {
    if (!usage?.[type]) return 0;
    return usage[type].percentage;
  };

  // Actions
  const refreshSubscription = useCallback(async (): Promise<void> => {
    await loadSubscriptionData();
  }, [loadSubscriptionData]);

  const upgradePlan = useCallback(async (planId: string): Promise<boolean> => {
    try {
      setUpgrading(true);
      
      const response = await apiClient.post('/api/v1/subscription/upgrade', {
        plan_id: planId,
        upgrade_type: 'manual'
      });
      
      if (response.data?.success) {
        await refreshSubscription();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
      return false;
    } finally {
      setUpgrading(false);
    }
  }, [refreshSubscription]);

  const getUpgradeMessage = (feature: string): string => {
    const featureNames: Record<string, string> = {
      'campaign_scheduling': 'campaign scheduling',
      'ab_testing': 'A/B testing',
      'segmentation': 'contact segmentation',
      'advanced_analytics': 'advanced analytics',
      'ai_content_generation': 'AI content generation',
      'team_collaboration': 'team collaboration',
      'pro_templates': 'professional templates'
    };
    
    const featureName = featureNames[feature] || feature.replace(/_/g, ' ');
    
    if (isFree()) {
      return `Upgrade to Pro to unlock ${featureName} and other advanced features.`;
    } else if (isPro() && !isEnterprise()) {
      return `Upgrade to Enterprise to unlock ${featureName} and AI-powered features.`;
    }
    
    return `This feature requires a higher subscription tier.`;
  };

  const contextValue: SubscriptionContextType = {
    subscription,
    plan,
    usage,
    features,
    upgradeSuggestions,
    availablePlans,
    loading,
    upgrading,
    hasFeature,
    canCreateCampaign,
    canSendToRecipients,
    canSendEmails,
    canCreateTemplate,
    canAddContacts,
    isPro,
    isEnterprise,
    isFree,
    isApproachingLimit,
    hasReachedLimit,
    getUsagePercentage,
    refreshSubscription,
    upgradePlan,
    getUpgradeMessage
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
}
