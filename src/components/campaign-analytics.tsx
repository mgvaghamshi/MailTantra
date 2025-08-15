"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Campaign } from "@/lib/emailtracker-api";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface CampaignAnalyticsProps {
  campaigns: Campaign[];
  className?: string;
}

export function CampaignAnalytics({ campaigns, className = "" }: CampaignAnalyticsProps) {
  if (!campaigns || campaigns.length === 0) {
    return null;
  }

  // Calculate analytics
  const totalSent = campaigns.reduce((sum, c) => sum + c.sent_count, 0);
  const avgOpenRate = campaigns.reduce((sum, c) => sum + c.open_rate, 0) / campaigns.length;
  const avgClickRate = campaigns.reduce((sum, c) => sum + c.click_rate, 0) / campaigns.length;
  
  // Get trend data (comparing last 30 days vs previous 30 days - mock for demo)
  const recentCampaigns = campaigns.slice(0, Math.floor(campaigns.length / 2));
  const olderCampaigns = campaigns.slice(Math.floor(campaigns.length / 2));
  
  const recentAvgOpen = recentCampaigns.length > 0 
    ? recentCampaigns.reduce((sum, c) => sum + c.open_rate, 0) / recentCampaigns.length 
    : 0;
  const olderAvgOpen = olderCampaigns.length > 0 
    ? olderCampaigns.reduce((sum, c) => sum + c.open_rate, 0) / olderCampaigns.length 
    : 0;
  
  const openRateTrend = recentAvgOpen - olderAvgOpen;
  
  const recentAvgClick = recentCampaigns.length > 0 
    ? recentCampaigns.reduce((sum, c) => sum + c.click_rate, 0) / recentCampaigns.length 
    : 0;
  const olderAvgClick = olderCampaigns.length > 0 
    ? olderCampaigns.reduce((sum, c) => sum + c.click_rate, 0) / olderCampaigns.length 
    : 0;
  
  const clickRateTrend = recentAvgClick - olderAvgClick;

  const getTrendIcon = (trend: number) => {
    if (trend > 0.5) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < -0.5) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0.5) return "text-green-600";
    if (trend < -0.5) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <Card className={`shadow-sm border-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/80 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg">Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {/* Total Emails Sent */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-blue-900">Total Emails Sent</h3>
              <div className="text-2xl font-bold text-blue-900">
                {totalSent.toLocaleString()}
              </div>
            </div>
            <p className="text-xs text-blue-700">
              Across {campaigns.length} campaigns
            </p>
          </div>

          {/* Average Open Rate */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-green-900">Avg Open Rate</h3>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-green-900">
                  {avgOpenRate.toFixed(1)}%
                </div>
                {getTrendIcon(openRateTrend)}
              </div>
            </div>
            <p className={`text-xs ${getTrendColor(openRateTrend)}`}>
              {openRateTrend > 0.5 ? '+' : openRateTrend < -0.5 ? '' : '±'}
              {Math.abs(openRateTrend).toFixed(1)}% vs previous period
            </p>
          </div>

          {/* Average Click Rate */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-purple-900">Avg Click Rate</h3>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-purple-900">
                  {avgClickRate.toFixed(1)}%
                </div>
                {getTrendIcon(clickRateTrend)}
              </div>
            </div>
            <p className={`text-xs ${getTrendColor(clickRateTrend)}`}>
              {clickRateTrend > 0.5 ? '+' : clickRateTrend < -0.5 ? '' : '±'}
              {Math.abs(clickRateTrend).toFixed(1)}% vs previous period
            </p>
          </div>
        </div>

        {/* Top Performing Campaigns */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Top Performing Campaigns</h3>
          <div className="space-y-2">
            {campaigns
              .sort((a, b) => (b.open_rate + b.click_rate) - (a.open_rate + a.click_rate))
              .slice(0, 3)
              .map((campaign, index) => (
                <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      'bg-orange-300 text-orange-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 truncate max-w-48">
                        {campaign.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {campaign.recipients_count} recipients
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {campaign.open_rate.toFixed(1)}% / {campaign.click_rate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-600">open / click</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
