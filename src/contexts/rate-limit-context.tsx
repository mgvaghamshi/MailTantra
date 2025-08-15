"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RateLimitModal } from '@/components/rate-limit-modal';

interface UsageData {
  limit: number;
  remaining: number;
  resetTime: number;
  used: number;
  percentage: number;
}

interface RateLimitContextType {
  isLimited: boolean;
  isAtWarning: boolean;
  timeUntilReset: number;
  showModal: boolean;
  hideModal: () => void;
  currentUsage: number;
  updateFromResponse: (response: Response) => void;
  refreshUsage: () => Promise<void>;
}

const RateLimitContext = createContext<RateLimitContextType | undefined>(undefined);

export function useRateLimit() {
  const context = useContext(RateLimitContext);
  if (context === undefined) {
    throw new Error('useRateLimit must be used within a RateLimitProvider');
  }
  return context;
}

interface RateLimitProviderProps {
  children: React.ReactNode;
}

export function RateLimitProvider({ children }: RateLimitProviderProps) {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [timeUntilReset, setTimeUntilReset] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  // Fetch usage data from our API endpoint
  const fetchUsageData = useCallback(async (): Promise<UsageData | null> => {
    try {
      const response = await fetch('/api/usage', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch usage data: ${response.status}`);
      }

      const data: UsageData = await response.json();
      return data;
    } catch (error) {
      // Silent error handling in production
      return null;
    }
  }, []);

  // Update usage data and check for rate limit
  const refreshUsage = useCallback(async () => {
    const data = await fetchUsageData();
    if (data) {
      setUsageData(data);
      
      // Check if remaining <= 0 to trigger modal
      if (data.remaining <= 0) {
        setShowModal(true);
        setIsPolling(true);
      } else if (data.percentage >= 90) {
        // Show warning at 90%
        setShowModal(true);
      }
    }
  }, [fetchUsageData]);

  // Update from API response headers (for real-time updates)
  const updateFromResponse = useCallback((response: Response) => {
    const headers = response.headers;
    
    // Extract rate limit headers
    const limitMinute = parseInt(headers.get('X-RateLimit-Limit-Minute') || '0');
    const remainingMinute = parseInt(headers.get('X-RateLimit-Remaining-Minute') || '0');
    const resetMinute = parseInt(headers.get('X-RateLimit-Reset-Minute') || '0');
    const usageMinute = parseInt(headers.get('X-RateLimit-Usage-Minute') || '0');

    const limitDay = parseInt(headers.get('X-RateLimit-Limit-Day') || '0');
    const remainingDay = parseInt(headers.get('X-RateLimit-Remaining-Day') || '0');
    const resetDay = parseInt(headers.get('X-RateLimit-Reset-Day') || '0');
    const usageDay = parseInt(headers.get('X-RateLimit-Usage-Day') || '0');

    // Process headers if available or if it's a 429 response
    if (limitMinute > 0 || limitDay > 0 || response.status === 429) {
      // Calculate which limit is more restrictive
      const minutePercentage = limitMinute > 0 ? (usageMinute / limitMinute) * 100 : 0;
      const dayPercentage = limitDay > 0 ? (usageDay / limitDay) * 100 : 0;

      let newUsageData: UsageData;

      if (response.status === 429) {
        // For 429 responses, set remaining to 0
        if (minutePercentage >= dayPercentage) {
          newUsageData = {
            limit: limitMinute || 10,
            remaining: 0,
            resetTime: resetMinute,
            used: limitMinute || 10,
            percentage: 100
          };
        } else {
          newUsageData = {
            limit: limitDay || 1000,
            remaining: 0,
            resetTime: resetDay,
            used: limitDay || 1000,
            percentage: 100
          };
        }
      } else {
        // Use the more restrictive limit
        if (minutePercentage >= dayPercentage) {
          newUsageData = {
            limit: limitMinute,
            remaining: remainingMinute,
            resetTime: resetMinute,
            used: usageMinute,
            percentage: minutePercentage
          };
        } else {
          newUsageData = {
            limit: limitDay,
            remaining: remainingDay,
            resetTime: resetDay,
            used: usageDay,
            percentage: dayPercentage
          };
        }
      }

      setUsageData(newUsageData);

      // Show modal immediately for 429 responses or when remaining <= 0
      if (response.status === 429 || newUsageData.remaining <= 0) {
        setShowModal(true);
        setIsPolling(true);
      } else if (newUsageData.percentage >= 90) {
        setShowModal(true);
      }
    }
  }, []);

  // Calculate derived states
  const currentUsagePercentage = usageData?.percentage || 0;
  const isAtWarning = currentUsagePercentage >= 90;
  const isLimited = usageData ? usageData.remaining <= 0 : false;

  // Hide modal function - only allow if not rate limited
  const hideModal = useCallback(() => {
    if (!isLimited) {
      setShowModal(false);
      setIsPolling(false);
    }
  }, [isLimited]);

  // Calculate reset time for modal
  const getResetTime = (): Date | undefined => {
    if (!usageData || !usageData.resetTime) return undefined;
    return new Date(usageData.resetTime * 1000);
  };

  // Timer effect for countdown and auto-refresh
  useEffect(() => {
    const updateTimer = () => {
      if (!usageData || !usageData.resetTime) {
        setTimeUntilReset(0);
        return;
      }

      const now = Math.floor(Date.now() / 1000);
      const remaining = Math.max(0, usageData.resetTime - now);
      setTimeUntilReset(remaining);
      
      // Auto-refresh when reset time is reached
      if (remaining <= 0 && isLimited) {
        refreshUsage();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [usageData, isLimited, refreshUsage]);

  // Polling effect - poll every 60 seconds when rate limited
  useEffect(() => {
    if (!isPolling) return;

    const pollInterval = setInterval(() => {
      refreshUsage();
    }, 60000); // Poll every 60 seconds

    return () => clearInterval(pollInterval);
  }, [isPolling, refreshUsage]);

  // Initial usage check on mount
  useEffect(() => {
    refreshUsage();
  }, [refreshUsage]);

  const value: RateLimitContextType = {
    isLimited,
    isAtWarning,
    timeUntilReset,
    showModal,
    hideModal,
    currentUsage: currentUsagePercentage,
    updateFromResponse,
    refreshUsage
  };

  return (
    <RateLimitContext.Provider value={value}>
      {/* Blocking overlay when rate limited */}
      {isLimited && showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]" />
      )}
      
      {children}
      
      {/* Global Rate Limit Modal */}
      <RateLimitModal
        isOpen={showModal}
        onClose={hideModal}
        usagePercentage={currentUsagePercentage}
        resetTime={getResetTime()}
        planName="Current Plan"
        isBlocked={isLimited}
      />
    </RateLimitContext.Provider>
  );
}

// Utility function to format time
export function formatTimeUntilReset(seconds: number): string {
  if (seconds <= 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}
