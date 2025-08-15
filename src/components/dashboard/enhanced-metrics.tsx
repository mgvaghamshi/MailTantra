'use client';

import React from 'react';
import { Mail, CheckCircle, Eye, MousePointer, TrendingUp, TrendingDown, AlertCircle, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Analytics {
  total_campaigns?: number;
  total_emails_sent?: number;
  total_delivered?: number;
  total_opened?: number;
  total_clicked?: number;
  overall_open_rate?: number;
  overall_click_rate?: number;
  recent_campaigns?: Array<{
    id: string;
    name: string;
    status: string;
    created_at: string;
    emails_sent: number;
    open_rate: number;
    click_rate: number;
  }>;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change: {
    value: string;
    trend: 'up' | 'down';
  };
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

function MetricCard({ title, value, change, icon: Icon, color, description, status }: MetricCardProps) {
  const statusColors = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <Badge className={statusColors[status]}>
          {status}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <div className="flex items-center space-x-2">
          {change.trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${
            change.trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change.value}
          </span>
        </div>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </Card>
  );
}

interface EnhancedMetricsProps {
  analytics: Analytics | null;
  loading: boolean;
  error: string | null;
}

export function EnhancedMetrics({ analytics, loading, error }: EnhancedMetricsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                <div className="w-16 h-8 bg-gray-200 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="w-32 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Failed to load analytics data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="mb-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No analytics data available. Start by creating your first email campaign.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getOpenRateStatus = (rate: number) => {
    if (rate >= 30) return 'success';
    if (rate >= 20) return 'warning';
    return 'info';
  };

  const getClickRateStatus = (rate: number) => {
    if (rate >= 5) return 'success';
    if (rate >= 2) return 'warning';
    return 'info';
  };

  const totalCampaigns = analytics.total_campaigns || 0;
  const totalDelivered = analytics.total_delivered || analytics.total_emails_sent || 0;
  const totalOpened = analytics.total_opened || 0;
  const totalClicked = analytics.total_clicked || 0;
  const overallOpenRate = analytics.overall_open_rate || 0;
  const overallClickRate = analytics.overall_click_rate || 0;

  // Only show positive trends if we have actual data
  const hasData = totalCampaigns > 0 || totalDelivered > 0;

  const metrics: MetricCardProps[] = [
    {
      title: "Total Campaigns",
      value: totalCampaigns,
      change: {
        value: hasData ? "+0%" : "0%",
        trend: "up" as const
      },
      icon: Mail,
      color: "bg-blue-50 text-blue-600",
      description: "Active email campaigns",
      status: "info" as const
    },
    {
      title: "Emails Delivered",
      value: totalDelivered,
      change: {
        value: hasData ? "+0%" : "0%",
        trend: "up" as const
      },
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
      description: "Successfully delivered emails",
      status: "success" as const
    },
    {
      title: "Open Rate",
      value: overallOpenRate ? `${overallOpenRate.toFixed(1)}%` : '0%',
      change: {
        value: hasData ? "+0%" : "0%",
        trend: "up" as const
      },
      icon: Eye,
      color: "bg-purple-50 text-purple-600",
      description: "Average email open rate",
      status: getOpenRateStatus(overallOpenRate) as "success" | "warning" | "info"
    },
    {
      title: "Click Rate",
      value: overallClickRate ? `${overallClickRate.toFixed(1)}%` : '0%',
      change: {
        value: hasData ? "+0%" : "0%",
        trend: "up" as const
      },
      icon: MousePointer,
      color: "bg-orange-50 text-orange-600",
      description: "Click-through rate",
      status: getClickRateStatus(overallClickRate) as "success" | "warning" | "info"
    }
  ];

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
        <Badge variant="outline" className="text-sm">
          {hasData ? "Real-time data" : "No data yet"}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {hasData && (
        <>
          {/* Performance Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Open Rate Performance</span>
                  <span className="font-medium">{overallOpenRate ? `${overallOpenRate.toFixed(1)}%` : '0%'}</span>
                </div>
                <Progress value={Math.min(overallOpenRate || 0, 100)} className="h-2" />
                <p className="text-xs text-gray-500">
                  Industry average: 21.5%
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Click Rate Performance</span>
                  <span className="font-medium">{overallClickRate ? `${overallClickRate.toFixed(1)}%` : '0%'}</span>
                </div>
                <Progress value={Math.min(overallClickRate || 0, 100)} className="h-2" />
                <p className="text-xs text-gray-500">
                  Industry average: 2.3%
                </p>
              </div>
            </div>
          </Card>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{totalOpened}</p>
                <p className="text-sm text-gray-600">Total Opens</p>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{totalClicked}</p>
                <p className="text-sm text-gray-600">Total Clicks</p>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.recent_campaigns?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Recent Campaigns</p>
              </div>
            </Card>
          </div>
        </>
      )}

      {!hasData && (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-600 mb-4">
                Start tracking your email performance by creating your first campaign.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
