import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import emailTrackerAPI from '@/lib/emailtracker-api';

export interface RateLimitInfo {
  usagePercentage: number;
  isNearLimit: boolean;
  isBlocked: boolean;
  resetTime?: Date;
  requestsUsed: number;
  requestsLimit: number;
  planName?: string;
}

export interface UseRateLimitOptions {
  checkInterval?: number; // in milliseconds, default 60000 (1 minute)
  warningThreshold?: number; // percentage, default 90
  enableAutoCheck?: boolean; // default true
}

export function useRateLimit(options: UseRateLimitOptions = {}) {
  const {
    checkInterval = 60000,
    warningThreshold = 90,
    enableAutoCheck = true
  } = options;

  const { isAuthenticated } = useAuth();
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo>({
    usagePercentage: 0,
    isNearLimit: false,
    isBlocked: false,
    requestsUsed: 0,
    requestsLimit: 10000
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckedRef = useRef<number>(0);

  const fetchRateLimitInfo = useCallback(async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      return;
    }

    // Prevent too frequent calls
    const now = Date.now();
    if (now - lastCheckedRef.current < 5000) { // Minimum 5 seconds between calls
      return;
    }
    lastCheckedRef.current = now;

    try {
      setLoading(true);
      setError(null);

      // Try to get aggregate API usage first
      const usageData = await emailTrackerAPI.getAggregateApiUsage();
      
      const usagePercentage = (usageData.total_requests_this_month / usageData.total_monthly_limit) * 100;
      const isNearLimit = usagePercentage >= warningThreshold;
      const isBlocked = usagePercentage >= 100;

      // Calculate reset time (assuming monthly reset)
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      
      const newRateLimitInfo: RateLimitInfo = {
        usagePercentage,
        isNearLimit,
        isBlocked,
        resetTime: nextMonth,
        requestsUsed: usageData.total_requests_this_month,
        requestsLimit: usageData.total_monthly_limit,
        planName: 'Current Plan'
      };

      setRateLimitInfo(newRateLimitInfo);

      // Show modal if blocked or approaching limit
      if (isBlocked || (isNearLimit && !showModal)) {
        setShowModal(true);
      }

    } catch (err) {
      // Fallback to demo data or handle gracefully
      const fallbackInfo: RateLimitInfo = {
        usagePercentage: 0,
        isNearLimit: false,
        isBlocked: false,
        requestsUsed: 0,
        requestsLimit: 10000
      };
      
      setRateLimitInfo(fallbackInfo);
      setError('Unable to fetch rate limit information');
    } finally {
      setLoading(false);
    }
  }, [warningThreshold, showModal]);

  // Handle rate limit response from API calls
  const handleRateLimitResponse = useCallback((response: Response) => {
    if (response.status === 429) {
      // Extract rate limit info from headers if available
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const limit = response.headers.get('X-RateLimit-Limit');
      const resetTime = response.headers.get('X-RateLimit-Reset');

      if (remaining && limit) {
        const usagePercentage = ((parseInt(limit) - parseInt(remaining)) / parseInt(limit)) * 100;
        const reset = resetTime ? new Date(parseInt(resetTime) * 1000) : undefined;

        setRateLimitInfo(prev => ({
          ...prev,
          usagePercentage,
          isNearLimit: usagePercentage >= warningThreshold,
          isBlocked: usagePercentage >= 100,
          resetTime: reset,
          requestsUsed: parseInt(limit) - parseInt(remaining),
          requestsLimit: parseInt(limit)
        }));

        setShowModal(true);
      } else {
        // Force a refresh of rate limit info
        fetchRateLimitInfo();
      }
    }
  }, [warningThreshold, fetchRateLimitInfo]);

  // Set up automatic checking
  useEffect(() => {
    if (!enableAutoCheck || !isAuthenticated) return;

    // Initial check
    fetchRateLimitInfo();

    // Set up interval
    intervalRef.current = setInterval(fetchRateLimitInfo, checkInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enableAutoCheck, checkInterval, fetchRateLimitInfo, isAuthenticated]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const closeModal = useCallback(() => {
    if (!rateLimitInfo.isBlocked) {
      setShowModal(false);
    }
  }, [rateLimitInfo.isBlocked]);

  const forceCheck = useCallback(() => {
    fetchRateLimitInfo();
  }, [fetchRateLimitInfo]);

  return {
    rateLimitInfo,
    loading,
    error,
    showModal,
    closeModal,
    handleRateLimitResponse,
    forceCheck
  };
}
