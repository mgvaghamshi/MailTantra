"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApiKeyUsage } from "@/hooks/use-emailtracker";
import { 
  Activity, 
  Clock, 
  TrendingUp,
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface ApiKeyUsageProps {
  apiKeyId: string;
  apiKeyName: string;
}

export function ApiKeyUsage({ apiKeyId, apiKeyName }: ApiKeyUsageProps) {
  const { data: usage, loading, error, refresh } = useApiKeyUsage(apiKeyId);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading usage stats...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Failed to load usage stats</p>
            <button 
              onClick={refresh}
              className="text-blue-600 hover:text-blue-800 text-sm mt-2"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!usage) {
    return null;
  }

  const minuteUtilization = (usage.current_minute_requests / usage.limit_minute) * 100;
  const dayUtilization = (usage.current_day_requests / usage.limit_day) * 100;

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 70) return "text-yellow-500";
    return "text-green-500";
  };

  const getUtilizationBadge = (percentage: number) => {
    if (percentage >= 90) return "destructive";
    if (percentage >= 70) return "secondary";
    return "default";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span>Usage Statistics - {apiKeyName}</span>
          <Badge variant="outline" className="ml-auto">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Minute Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium">Current Minute</span>
            </div>
            <Badge variant={getUtilizationBadge(minuteUtilization)}>
              {minuteUtilization.toFixed(1)}%
            </Badge>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                minuteUtilization >= 90 ? 'bg-red-500' :
                minuteUtilization >= 70 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(minuteUtilization, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{usage.current_minute_requests} requests</span>
            <span>{usage.remaining_minute} remaining</span>
          </div>
        </div>

        {/* Current Day Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium">Current Day</span>
            </div>
            <Badge variant={getUtilizationBadge(dayUtilization)}>
              {dayUtilization.toFixed(1)}%
            </Badge>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                dayUtilization >= 90 ? 'bg-red-500' :
                dayUtilization >= 70 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(dayUtilization, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{usage.current_day_requests.toLocaleString()} requests</span>
            <span>{usage.remaining_day.toLocaleString()} remaining</span>
          </div>
        </div>

        {/* Limits Summary */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{usage.limit_minute}</p>
            <p className="text-xs text-gray-500">Per minute limit</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{usage.limit_day.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Per day limit</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center space-x-2 pt-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm text-gray-600">
            Auto-refreshes every 30 seconds
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
