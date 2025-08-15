"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import emailTrackerAPI, { HistoricalAnalytics } from '@/lib/emailtracker-api';

export function useHistoricalAnalytics() {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<HistoricalAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchHistoricalAnalytics = async () => {
      // Don't fetch if not authenticated
      if (!isAuthenticated) {
        if (mounted) {
          setData(null);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setAuthError(false);
        
        const historicalData = await emailTrackerAPI.getHistoricalAnalytics();
        
        if (mounted) {
          setData(historicalData);
        }
      } catch (err: any) {
        if (mounted) {
          const errorMessage = err?.message || 'Failed to fetch historical analytics';
          setError(errorMessage);
          
          // Check for authentication errors
          if (errorMessage.includes('401') || 
              errorMessage.includes('403') || 
              errorMessage.includes('Not authenticated') ||
              errorMessage.includes('Invalid API key')) {
            setAuthError(true);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchHistoricalAnalytics();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  const refetch = async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    setError(null);
    setAuthError(false);
    
    try {
      const historicalData = await emailTrackerAPI.getHistoricalAnalytics();
      setData(historicalData);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch historical analytics';
      setError(errorMessage);
      
      if (errorMessage.includes('401') || 
          errorMessage.includes('403') || 
          errorMessage.includes('Not authenticated') ||
          errorMessage.includes('Invalid API key')) {
        setAuthError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    authError,
    refetch
  };
}
