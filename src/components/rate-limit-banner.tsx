"use client";

import { useRateLimit } from "@/contexts/rate-limit-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RateLimitBanner() {
  const { isLimited, isAtWarning, timeUntilReset, currentUsage } = useRateLimit();

  const usagePercentage = Math.round(currentUsage);

  if (isLimited) {
    return (
      <Alert className="border-red-200 bg-red-50 text-red-800">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between w-full">
          <div>
            <strong>API Limit Reached ({usagePercentage}%)</strong>
            <p className="text-sm mt-1">
              You&apos;ve reached your API usage limit. New requests will be blocked until your limit resets.
            </p>
          </div>
          <Button variant="outline" size="sm" className="ml-4">
            <TrendingUp className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isAtWarning) {
    return (
      <Alert className="border-orange-200 bg-orange-50 text-orange-800">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between w-full">
          <div>
            <strong>API Usage Critical ({usagePercentage}%)</strong>
            <p className="text-sm mt-1">
              You&apos;re at 90%+ of your API usage limit. Upgrade now to avoid service interruption.
            </p>
          </div>
          <Button variant="outline" size="sm" className="ml-4">
            <TrendingUp className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (currentUsage >= 80) {
    return (
      <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800">
        <Clock className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between w-full">
          <div>
            <strong>API Usage Warning ({usagePercentage}%)</strong>
            <p className="text-sm mt-1">
              You&apos;re approaching your API usage limit. Consider upgrading your plan to avoid service interruption.
            </p>
          </div>
          <Button variant="outline" size="sm" className="ml-4">
            <TrendingUp className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
