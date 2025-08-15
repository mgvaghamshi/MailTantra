'use client';

import { useAuth } from '@/contexts/auth-context';
import { useMemo } from 'react';

export type UserTier = 'basic' | 'premium' | 'enterprise';

export interface PremiumFeatureAccess {
  abTesting: boolean;
  livePreview: boolean;
  deliveryLogs: boolean;
  autoSave: boolean;
  multipleTemplates: boolean;
  campaignVersioning: boolean;
  advancedAnalytics: boolean;
  customSegmentation: boolean;
}

export function useUserPermissions() {
  // For development: Enable all premium features
  const DEV_MODE = process.env.NODE_ENV === 'development' || true; // Always enable for now
  
  const user = {
    tier: DEV_MODE ? 'enterprise' : 'basic', // Set to enterprise in dev mode
    role: 'admin'
  };

  const premiumFeatures: PremiumFeatureAccess = {
    abTesting: DEV_MODE || user.tier === 'premium' || user.tier === 'enterprise',
    livePreview: true, // Available to all users
    deliveryLogs: DEV_MODE || user.tier === 'premium' || user.tier === 'enterprise',
    autoSave: DEV_MODE || user.tier === 'premium' || user.tier === 'enterprise',
    multipleTemplates: DEV_MODE || user.tier === 'premium' || user.tier === 'enterprise',
    campaignVersioning: DEV_MODE || user.tier === 'enterprise',
    advancedAnalytics: DEV_MODE || user.tier === 'premium' || user.tier === 'enterprise',
    customSegmentation: DEV_MODE || user.tier === 'enterprise',
  };

  return {
    user,
    hasAccess: (feature: keyof PremiumFeatureAccess) => premiumFeatures[feature],
    premiumFeatures,
    canManageCampaigns: true,
    canManageUsers: user.role === 'admin',
    canExportData: true,
    canViewAnalytics: true,
    getUpgradeMessage: (feature: keyof PremiumFeatureAccess) => 
      `Upgrade to Premium to access ${feature.replace(/([A-Z])/g, ' $1').toLowerCase()} feature.`,
  };
}
