"use client";

import { useEffect } from 'react';
import { useRateLimit } from '@/contexts/rate-limit-context';
import emailTrackerAPI from '@/lib/emailtracker-api';

/**
 * Component to initialize API rate limit callback
 * Should be placed inside RateLimitProvider
 */
export function ApiRateLimitInitializer() {
  const { updateFromResponse } = useRateLimit();

  useEffect(() => {
    // Set up the rate limit callback for the API client
    emailTrackerAPI.setRateLimitCallback(updateFromResponse);
  }, [updateFromResponse]);

  return null; // This component doesn't render anything
}
