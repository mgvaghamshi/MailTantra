"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAnalytics } from "@/hooks/use-emailtracker";
import { useAuth } from "@/contexts/auth-context";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import emailTrackerAPI from "@/lib/emailtracker-api";
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  Mail,
  Users,
  Calendar,
  Download,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Lock
} from "lucide-react";
import Link from "next/link";

interface DeliverabilityStats {
  inbox_rate: number;
  spam_rate: number;
  bounce_rate: number;
  reputation_score: number;
}

interface SummaryStats {
  emails_last_24h: number;
  opens_last_24h: number;
  clicks_last_24h: number;
  active_campaigns: number;
}

export default function AnalyticsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  // Show login prompt if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to view your analytics dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/login">
              <Button className="w-full">
                Log In to Continue
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AuthGuard fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <AnalyticsDashboard />
    </AuthGuard>
  );
}

function AnalyticsDashboard() {
  const { data: analytics, loading, error, refresh } = useAnalytics();
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deliverabilityStats, setDeliverabilityStats] = useState<DeliverabilityStats | null>(null);
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Refresh analytics data
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refresh();
      setLastUpdated(new Date());
      
      // Also refresh additional analytics
      const [deliverability, summary] = await Promise.all([
        emailTrackerAPI.getDeliverabilityStats(),
        emailTrackerAPI.getAnalyticsSummary()
      ]);
      setDeliverabilityStats(deliverability as unknown as DeliverabilityStats);
      setSummaryStats(summary as unknown as SummaryStats);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refresh]);

  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRefreshing) {
        handleRefresh();
      }
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [isRefreshing, handleRefresh]);

  // Fetch additional analytics data
  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const [deliverability, summary] = await Promise.all([
          emailTrackerAPI.getDeliverabilityStats(),
          emailTrackerAPI.getAnalyticsSummary()
        ]);
        setDeliverabilityStats(deliverability as unknown as DeliverabilityStats);
        setSummaryStats(summary as unknown as SummaryStats);
      } catch (error) {
        console.error('Failed to fetch additional analytics:', error);
      }
    };

    if (analytics) {
      fetchAdditionalData();
    }
  }, [analytics]);

  // Export analytics data as CSV
  const handleExport = async () => {
    if (!analytics) return;
    
    setIsExporting(true);
    try {
      // Create CSV content
      const csvContent = [
        // Header
        ['Metric', 'Value', 'Percentage'].join(','),
        // Data rows
        ['Total Campaigns', analytics.total_campaigns, ''].join(','),
        ['Total Emails Sent', analytics.total_emails_sent, ''].join(','),
        ['Delivered', analytics.total_delivered, `${analytics.total_emails_sent ? ((analytics.total_delivered / analytics.total_emails_sent) * 100).toFixed(1) : 0}%`].join(','),
        ['Opened', analytics.total_opened, `${analytics.overall_open_rate.toFixed(1)}%`].join(','),
        ['Clicked', analytics.total_clicked, `${analytics.overall_click_rate.toFixed(1)}%`].join(','),
        ['Bounced', analytics.total_bounced, `${analytics.overall_bounce_rate.toFixed(1)}%`].join(','),
        ['Unsubscribed', analytics.total_unsubscribed, `${analytics.overall_unsubscribe_rate.toFixed(1)}%`].join(','),
        '',
        // Campaign data
        ['Campaign Name', 'Status', 'Emails Sent', 'Open Rate', 'Click Rate'].join(','),
        ...analytics.recent_campaigns.map(campaign => 
          [campaign.name, campaign.status, campaign.emails_sent, `${campaign.open_rate.toFixed(1)}%`, `${campaign.click_rate.toFixed(1)}%`].join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `email-analytics-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Navigate to campaign details
  const handleCampaignClick = (campaignId: string) => {
    window.location.href = `/campaigns?id=${campaignId}`;
  };

  // Date range handler (for future implementation)
  const handleDateRange = () => {
    // TODO: Implement date range picker
    alert('Date range picker will be implemented in the next update');
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-600" />
            <p className="text-red-600 mb-2">Failed to load analytics</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate rates
  const openRate = analytics?.total_emails_sent ? ((analytics.total_opened / analytics.total_emails_sent) * 100).toFixed(1) : '0.0';
  const clickRate = analytics?.total_emails_sent ? ((analytics.total_clicked / analytics.total_emails_sent) * 100).toFixed(1) : '0.0';
  const deliveryRate = analytics?.total_emails_sent ? ((analytics.total_delivered / analytics.total_emails_sent) * 100).toFixed(1) : '0.0';
  const bounceRate = analytics?.total_emails_sent ? ((analytics.total_bounced / analytics.total_emails_sent) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600">
            Detailed insights into your email campaign performance and engagement metrics
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()} • Auto-refreshes every minute
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline" onClick={handleDateRange}>
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={isExporting || !analytics}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.total_emails_sent?.toLocaleString() || '0'}</div>
            <div className="flex items-center space-x-1 mt-1">
              <span className="text-xs text-gray-500">Across {analytics?.total_campaigns || 0} campaigns</span>
              <TrendingUp className="h-3 w-3 text-green-500 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openRate}%</div>
            <div className="flex items-center space-x-1 mt-1">
              <span className="text-xs text-gray-500">{analytics?.total_opened?.toLocaleString() || '0'} opens</span>
              {parseFloat(openRate) > 20 ? (
                <TrendingUp className="h-3 w-3 text-green-500 ml-2" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 ml-2" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click-through Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clickRate}%</div>
            <div className="flex items-center space-x-1 mt-1">
              <span className="text-xs text-gray-500">{analytics?.total_clicked?.toLocaleString() || '0'} clicks</span>
              {parseFloat(clickRate) > 5 ? (
                <TrendingUp className="h-3 w-3 text-green-500 ml-2" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 ml-2" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryRate}%</div>
            <div className="flex items-center space-x-1 mt-1">
              <span className="text-xs text-gray-500">{analytics?.total_delivered?.toLocaleString() || '0'} delivered</span>
              {parseFloat(deliveryRate) > 95 ? (
                <TrendingUp className="h-3 w-3 text-green-500 ml-2" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 ml-2" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics */}
      {deliverabilityStats && (
        <Card>
          <CardHeader>
            <CardTitle>Deliverability Analysis</CardTitle>
            <CardDescription>
              Detailed insights into email deliverability and reputation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {deliverabilityStats.inbox_rate || '0'}%
                </div>
                <div className="text-sm text-gray-600">Inbox Rate</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {deliverabilityStats.spam_rate || '0'}%
                </div>
                <div className="text-sm text-gray-600">Spam Rate</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {deliverabilityStats.bounce_rate || '0'}%
                </div>
                <div className="text-sm text-gray-600">Bounce Rate</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {deliverabilityStats.reputation_score || '0'}/100
                </div>
                <div className="text-sm text-gray-600">Reputation Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Email Performance Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Email Performance Overview</CardTitle>
            <CardDescription>
              Visual breakdown of email delivery and engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Sent', value: analytics?.total_emails_sent || 0, color: '#3b82f6' },
                    { name: 'Delivered', value: analytics?.total_delivered || 0, color: '#10b981' },
                    { name: 'Opened', value: analytics?.total_opened || 0, color: '#f59e0b' },
                    { name: 'Clicked', value: analytics?.total_clicked || 0, color: '#8b5cf6' },
                    { name: 'Bounced', value: analytics?.total_bounced || 0, color: '#ef4444' },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Performance Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Distribution</CardTitle>
            <CardDescription>
              Email distribution across recent campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.recent_campaigns?.map(campaign => ({
                      name: campaign.name,
                      value: campaign.emails_sent,
                      fill: `hsl(${Math.random() * 360}, 70%, 50%)`
                    })) || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {analytics?.recent_campaigns?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 137.5}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Summary */}
      {summaryStats && (
        <Card>
          <CardHeader>
            <CardTitle>Real-time Summary</CardTitle>
            <CardDescription>
              Live metrics updated every few minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {summaryStats.emails_last_24h || 0}
                </div>
                <div className="text-sm text-gray-500">Emails (24h)</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {summaryStats.opens_last_24h || 0}
                </div>
                <div className="text-sm text-gray-500">Opens (24h)</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {summaryStats.clicks_last_24h || 0}
                </div>
                <div className="text-sm text-gray-500">Clicks (24h)</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {summaryStats.active_campaigns || 0}
                </div>
                <div className="text-sm text-gray-500">Active Campaigns</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Overall Performance Summary</CardTitle>
            <CardDescription>
              Key metrics across all campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Email Performance</h4>
                  <Badge variant="outline">{analytics?.total_emails_sent?.toLocaleString() || '0'} emails</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Delivered</div>
                    <div className="font-medium">{analytics?.total_delivered?.toLocaleString() || '0'}</div>
                    <div className="text-xs text-green-600">{deliveryRate}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Bounced</div>
                    <div className="font-medium">{analytics?.total_bounced?.toLocaleString() || '0'}</div>
                    <div className="text-xs text-red-600">{bounceRate}%</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Engagement</h4>
                  <Badge variant="outline">{analytics?.total_opens?.toLocaleString() || '0'} total opens</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Opens</div>
                    <div className="font-medium">{analytics?.total_opened?.toLocaleString() || '0'}</div>
                    <div className="text-xs text-green-600">{openRate}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Clicks</div>
                    <div className="font-medium">{analytics?.total_clicked?.toLocaleString() || '0'}</div>
                    <div className="text-xs text-purple-600">{clickRate}%</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>
              Your latest email campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.recent_campaigns?.length ? (
                analytics.recent_campaigns.map((campaign) => (
                  <div 
                    key={campaign.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleCampaignClick(campaign.id)}
                  >
                    <div>
                      <div className="font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-sm text-gray-500">
                        {campaign.status} • {new Date(campaign.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{campaign.emails_sent} emails</div>
                      <div className="text-xs text-gray-500">
                        {campaign.open_rate.toFixed(1)}% opens • {campaign.click_rate.toFixed(1)}% clicks
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Mail className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No campaigns found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
