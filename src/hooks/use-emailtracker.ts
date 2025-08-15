"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import emailTrackerAPI, { 
  EmailTracker, 
  Campaign, 
  Contact, 
  Analytics, 
  DashboardAnalytics,
  ApiKeyData,
  ApiKeyListItem,
  ApiKeyCreateResponse,
  ApiKeyUsageStats,
  Template,
  TemplateList,
  TemplateStats
} from '@/lib/emailtracker-api';

// Custom hook for API loading states
export function useAsyncData<T>(
  asyncFunction: () => Promise<T>,
  dependencies: unknown[] = []
) {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);

  const refresh = async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setIsAuthError(false);
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      
      // Check if this is a rate limit error - don't treat as regular error
      if (err && typeof err === 'object' && (
        ('status' in err && err.status === 429) || 
        ('rateLimited' in err && err.rateLimited === true)
      )) {
        // Rate limit error - don't set error state, let the rate limit modal handle it
        // Just keep the existing data (or null) to avoid showing demo data
        setError(null);
        return;
      }
      
      // Check if this is an authentication error
      if (errorMessage.includes('Not authenticated') || errorMessage.includes('403')) {
        setIsAuthError(true);
        setError('Authentication required - please log in to view your data');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [...dependencies, isAuthenticated]);

  return { data, loading, error, refresh, isAuthError };
}

// Analytics hook
export function useAnalytics() {
  return useAsyncData<DashboardAnalytics>(
    () => emailTrackerAPI.getDashboardAnalytics(),
    []
  );
}

// Email trackers hook
export function useEmailTrackers(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useAsyncData(
    () => emailTrackerAPI.getEmailTrackers(params),
    [params?.page, params?.limit, params?.status]
  );
}

// Campaigns hook
export function useCampaigns() {
  return useAsyncData<Campaign[]>(
    () => emailTrackerAPI.getCampaigns(),
    []
  );
}

// Contacts hook
export function useContacts(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  return useAsyncData(
    () => emailTrackerAPI.getContacts(params),
    [params?.page, params?.limit, params?.status, params?.search]
  );
}

// Templates hook
export function useTemplates(params?: {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  search?: string;
  folder_id?: string;
  include_system?: boolean;
}) {
  return useAsyncData(
    () => emailTrackerAPI.getTemplates(params),
    [params?.page, params?.limit, params?.type, params?.status, params?.search, params?.folder_id, params?.include_system]
  );
}

// Template stats hook
export function useTemplateStats() {
  return useAsyncData(
    () => emailTrackerAPI.getTemplateStats(),
    []
  );
}

// API Keys hook
export function useApiKeys() {
  return useAsyncData<ApiKeyListItem[]>(
    () => emailTrackerAPI.getApiKeys(),
    []
  );
}

// Health check hook
export function useHealthCheck() {
  return useAsyncData(
    () => emailTrackerAPI.healthCheck(),
    []
  );
}

// Hook for sending emails
export function useSendEmail() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (data: {
    to_email: string;
    from_email: string;
    from_name?: string;
    subject: string;
    html_content?: string;
    text_content?: string;
    campaign_id?: string;
  }) => {
    try {
      setSending(true);
      setError(null);
      const result = await emailTrackerAPI.sendEmail(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send email';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  return { sendEmail, sending, error };
}

// Hook for creating campaigns
export function useCreateCampaign() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCampaign = async (campaign: Partial<Campaign>) => {
    try {
      setCreating(true);
      setError(null);
      const result = await emailTrackerAPI.createCampaign(campaign);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create campaign';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  return { createCampaign, creating, error };
}

// Hook for managing API keys
export function useApiKeyManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createApiKey = async (data: { 
    name: string; 
    user_id?: string;
    requests_per_minute?: number;
    requests_per_day?: number;
    expires_in_days?: number;
  }): Promise<ApiKeyCreateResponse> => {
    try {
      setLoading(true);
      setError(null);
      const result = await emailTrackerAPI.createApiKey(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create API key';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await emailTrackerAPI.deleteApiKey(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete API key';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createApiKey, deleteApiKey, loading, error };
}

// Hook for default template management
export function useDefaultTemplates() {
  const { isAuthenticated } = useAuth();
  const [checking, setChecking] = useState(false);
  const [setting, setSetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDefaults = async () => {
    if (!isAuthenticated) return null;
    
    try {
      setChecking(true);
      setError(null);
      const result = await emailTrackerAPI.checkDefaultTemplates();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check default templates';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setChecking(false);
    }
  };

  const setupDefaults = async () => {
    if (!isAuthenticated) return null;
    
    try {
      setSetting(true);
      setError(null);
      const result = await emailTrackerAPI.setupDefaultTemplates();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to setup default templates';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSetting(false);
    }
  };

  return { checkDefaults, setupDefaults, checking, setting, error };
}

// Hook for API key usage stats
export function useApiKeyUsage(apiKeyId: string) {
  const [data, setData] = useState<ApiKeyUsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!apiKeyId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await emailTrackerAPI.getApiKeyUsage(apiKeyId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch usage stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [apiKeyId]);

  return { data, loading, error, refresh };
}
