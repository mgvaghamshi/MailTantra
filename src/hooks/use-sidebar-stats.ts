"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { emailTrackerAPI } from '@/lib/emailtracker-api';

interface SidebarStats {
  contactsCount: number;
  campaignsCount: number;
  apiUsage: {
    used: number;
    total: number;
    percentage: number;
  };
}

export function useSidebarStats() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<SidebarStats>({
    contactsCount: 0,
    campaignsCount: 0,
    apiUsage: {
      used: 0,
      total: 10000,
      percentage: 0
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching sidebar stats...');

      // Fetch all data in parallel
      const [contactsResponse, campaignsResponse, apiUsageResponse] = await Promise.all([
        emailTrackerAPI.getContacts({ page: 1, limit: 1 }),
        emailTrackerAPI.getCampaigns(),
        emailTrackerAPI.getAggregateApiUsage()
      ]);

      console.log('API Usage Response:', apiUsageResponse);

      const contactsCount = contactsResponse.total || 0;
      const campaignsCount = campaignsResponse.length || 0;

      setStats({
        contactsCount,
        campaignsCount,
        apiUsage: {
          used: apiUsageResponse.totalRequests || 0,
          total: apiUsageResponse.dailyLimit || 10000,
          percentage: apiUsageResponse.totalRequests && apiUsageResponse.dailyLimit
            ? Math.round((apiUsageResponse.totalRequests / apiUsageResponse.dailyLimit) * 100)
            : 0
        }
      });

      console.log('Stats updated:', {
        contactsCount,
        campaignsCount,
        apiUsage: {
          used: apiUsageResponse.totalRequests || 0,
          total: apiUsageResponse.dailyLimit || 10000,
          percentage: apiUsageResponse.totalRequests && apiUsageResponse.dailyLimit
            ? Math.round((apiUsageResponse.totalRequests / apiUsageResponse.dailyLimit) * 100)
            : 0
        }
      });
    } catch (err) {
      console.error('Error fetching sidebar stats:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching stats');
      
      // Set fallback stats
      setStats({
        contactsCount: 0,
        campaignsCount: 0,
        apiUsage: {
          used: 0,
          total: 10000,
          percentage: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if authenticated
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  return { stats, loading, error, refresh: fetchStats };
}

// Helper function to format numbers
export function formatCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
}
