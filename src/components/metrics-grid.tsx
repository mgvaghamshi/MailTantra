"use client"

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/hooks/use-emailtracker";
import { demoAnalytics } from "@/lib/demo-data";
import { 
  TrendingUp, 
  TrendingDown, 
  Mail, 
  Users, 
  MousePointer, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Loader2
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down";
  };
  icon: React.ReactNode;
  description?: string;
  status?: "success" | "warning" | "error";
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  icon, 
  description,
  status 
}: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        
        {change && (
          <div className="flex items-center space-x-1">
            {change.trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                change.trend === "up" ? "text-green-600" : "text-red-600"
              )}
            >
              {change.value}
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        )}

        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}

        {status && (
          <div className="absolute top-2 right-2">
            {status === "success" && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            {status === "warning" && (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
            {status === "error" && (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MetricsGrid() {
  const { data: analytics, loading, error, isAuthError } = useAnalytics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // If authentication error, use demo data
  if (isAuthError || (error && (error.includes('Not authenticated') || error.includes('403')))) {
    const metrics: MetricCardProps[] = [
      {
        title: "Total Campaigns",
        value: demoAnalytics.total_campaigns.toLocaleString(),
        icon: <Mail className="h-5 w-5 text-blue-600" />,
        description: "Demo data - Active campaigns"
      },
      {
        title: "Emails Delivered",
        value: demoAnalytics.total_delivered.toLocaleString(),
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        description: "Demo data - Successfully delivered"
      },
      {
        title: "Open Rate",
        value: `${demoAnalytics.overall_open_rate.toFixed(1)}%`,
        change: { 
          value: demoAnalytics.overall_open_rate > 25 ? "+3.1%" : "-1.2%", 
          trend: demoAnalytics.overall_open_rate > 25 ? "up" as const : "down" as const 
        },
        icon: <Eye className="h-5 w-5 text-purple-600" />,
        description: "Demo data - Average open rate",
        status: demoAnalytics.overall_open_rate > 25 ? "success" : demoAnalytics.overall_open_rate > 15 ? "warning" : "error"
      },
      {
        title: "Click Rate",
        value: `${demoAnalytics.overall_click_rate.toFixed(1)}%`,
        change: { 
          value: demoAnalytics.overall_click_rate > 5 ? "+2.8%" : "-0.8%", 
          trend: demoAnalytics.overall_click_rate > 5 ? "up" as const : "down" as const 
        },
        icon: <MousePointer className="h-5 w-5 text-orange-600" />,
        description: "Demo data - Click through rate",
        status: demoAnalytics.overall_click_rate > 5 ? "success" : demoAnalytics.overall_click_rate > 2 ? "warning" : "error"
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="col-span-full">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Failed to load analytics data</p>
              <p className="text-xs text-red-500 mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="col-span-full">
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-sm text-gray-600">No analytics data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const metrics: MetricCardProps[] = [
    {
      title: "Total Campaigns",
      value: analytics.total_campaigns.toLocaleString(),
      icon: <Mail className="h-5 w-5 text-blue-600" />,
      description: "Active campaigns"
    },
    {
      title: "Emails Delivered",
      value: analytics.total_delivered.toLocaleString(),
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      description: "Successfully delivered"
    },
    {
      title: "Open Rate",
      value: `${analytics.overall_open_rate.toFixed(1)}%`,
      change: { 
        value: analytics.overall_open_rate > 25 ? "+3.1%" : "-1.2%", 
        trend: analytics.overall_open_rate > 25 ? "up" as const : "down" as const 
      },
      icon: <Eye className="h-5 w-5 text-purple-600" />,
      description: "Average open rate",
      status: analytics.overall_open_rate > 25 ? "success" : analytics.overall_open_rate > 15 ? "warning" : "error"
    },
    {
      title: "Click Rate",
      value: `${analytics.overall_click_rate.toFixed(1)}%`,
      change: { 
        value: analytics.overall_click_rate > 5 ? "+2.8%" : "-0.8%", 
        trend: analytics.overall_click_rate > 5 ? "up" as const : "down" as const 
      },
      icon: <MousePointer className="h-5 w-5 text-orange-600" />,
      description: "Click through rate",
      status: analytics.overall_click_rate > 5 ? "success" : analytics.overall_click_rate > 2 ? "warning" : "error"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}