"use client";

import React, { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Mail, 
  TrendingUp, 
  Activity, 
  Key,
  FileText,
  BarChart3,
  Eye,
  MousePointer,
  Calendar,
  Plus,
  ArrowRight,
  Send,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Zap,
  Target,
  Globe,
  Settings,
  Loader2
} from 'lucide-react';
import { useAnalytics, useCampaigns, useContacts, useApiKeys } from '@/hooks/use-emailtracker';
import { Campaign, Contact } from '@/lib/emailtracker-api';
import { NewCampaignDialog } from '@/components/new-campaign-dialog';
import { EnhancedMetrics } from '@/components/dashboard/enhanced-metrics';
import { LoadingCampaignCard, LoadingContactCard, DashboardSkeleton } from '@/components/dashboard/loading-states';
import { DataErrorBoundary, EmptyState } from '@/components/dashboard/error-states';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

// Campaign Card Component
function CampaignCard({ campaign, loading = false }: { campaign: Campaign; loading?: boolean }) {
  if (loading) {
    return <LoadingCampaignCard />;
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-400" },
      active: { color: "bg-blue-100 text-blue-600 border-blue-200", dot: "bg-blue-500" },
      completed: { color: "bg-green-100 text-green-600 border-green-200", dot: "bg-green-500" },
      sent: { color: "bg-green-100 text-green-600 border-green-200", dot: "bg-green-500" },
      scheduled: { color: "bg-purple-100 text-purple-600 border-purple-200", dot: "bg-purple-500" },
      paused: { color: "bg-red-100 text-red-600 border-red-200", dot: "bg-red-500" }
    } as const;
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border", config.color)}>
        <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)}></span>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Never";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown";
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 group border border-gray-200 hover:border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {campaign.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 truncate">{campaign.subject || 'No subject'}</p>
          </div>
          {getStatusBadge(campaign.status)}
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{formatDate(campaign.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span>{(campaign.recipients_count || 0).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <Eye className="h-3 w-3" />
              <span className="text-xs">Opens</span>
            </div>
            <div className="font-semibold text-gray-900">
              {campaign.open_rate ? `${(campaign.open_rate * 100).toFixed(1)}%` : '0%'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <MousePointer className="h-3 w-3" />
              <span className="text-xs">Clicks</span>
            </div>
            <div className="font-semibold text-gray-900">
              {campaign.click_rate ? `${(campaign.click_rate * 100).toFixed(1)}%` : '0%'}
            </div>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="w-full group-hover:bg-blue-50 group-hover:border-blue-200" asChild>
          <a href={`/campaigns/${campaign.id}`}>
            View Details
            <ArrowRight className="h-3 w-3 ml-1" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

// Contact Card Component
function ContactCard({ contact, loading = false }: { contact: Contact; loading?: boolean }) {
  if (loading) {
    return <LoadingContactCard />;
  }

  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return '?';
  };

  const getAvatarColor = (email: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-orange-500 to-orange-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
    ];
    const index = email.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0",
          getAvatarColor(contact.email)
        )}>
          {getInitials(contact.first_name, contact.last_name, contact.email)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-gray-900 truncate">
            {contact.first_name && contact.last_name 
              ? `${contact.first_name} ${contact.last_name}`
              : contact.email
            }
          </div>
          <div className="text-sm text-gray-500 truncate">{contact.email}</div>
        </div>
      </div>
      <Badge 
        variant={contact.status === 'active' ? 'default' : 'secondary'}
        className="flex-shrink-0"
      >
        {contact.status || 'active'}
      </Badge>
    </div>
  );
}

export default function DashboardPage() {
  // Fetch data from hooks
  const { data: analyticsData, loading: analyticsLoading, error: analyticsError, refresh: refreshAnalytics } = useAnalytics();
  const { data: campaignsData, loading: campaignsLoading, error: campaignsError, refresh: refreshCampaigns } = useCampaigns();
  const { data: contactsData, loading: contactsLoading, error: contactsError, refresh: refreshContacts } = useContacts();
  const { data: apiKeysData, loading: apiKeysLoading } = useApiKeys();

  // Use only real API data, no demo data
  const campaigns = (campaignsData || []).slice(0, 4);
  const contacts = (Array.isArray(contactsData) ? contactsData : contactsData?.data || []).slice(0, 4);

  const isInitialLoading = analyticsLoading && campaignsLoading && contactsLoading;

  // Show skeleton on initial load
  if (isInitialLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <p className="text-gray-600">
            Monitor your campaigns, track performance, and manage your email marketing from one central location.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <a href="/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </a>
          </Button>
          <NewCampaignDialog 
            buttonText="New Campaign"
            buttonClassName="bg-blue-600 hover:bg-blue-700 text-white"
          />
        </div>
      </div>

      {/* Enhanced Metrics Section */}
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded-lg"></div>
            </div>
          ))}
        </div>
      }>
        <EnhancedMetrics 
          analytics={analyticsData} 
          loading={analyticsLoading} 
          error={analyticsError} 
        />
      </Suspense>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Campaigns - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    Recent Campaigns
                  </CardTitle>
                  <CardDescription>Your latest email campaigns and their performance</CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <a href="/campaigns">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {campaignsError ? (
                <DataErrorBoundary error={campaignsError} onRetry={refreshCampaigns} />
              ) : campaignsLoading ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <LoadingCampaignCard key={i} />
                  ))}
                </div>
              ) : campaigns.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {campaigns.map((campaign: Campaign, index: number) => (
                    <CampaignCard key={campaign.id || index} campaign={campaign} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No campaigns yet"
                  message="Get started by creating your first email campaign"
                  actionLabel="Create Campaign"
                  onAction={() => window.location.href = '/campaigns/create'}
                  icon={Mail}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Takes 1 column */}
        <div className="space-y-6">
          {/* Recent Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Recent Contacts
              </CardTitle>
              <CardDescription>Latest contacts added to your lists</CardDescription>
            </CardHeader>
            <CardContent>
              {contactsError ? (
                <DataErrorBoundary error={contactsError} onRetry={refreshContacts} />
              ) : contactsLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <LoadingContactCard key={i} />
                  ))}
                </div>
              ) : contacts.length > 0 ? (
                <div className="space-y-1">
                  {contacts.map((contact: Contact, index: number) => (
                    <ContactCard key={contact.id || index} contact={contact} />
                  ))}
                  <div className="pt-3">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="/contacts">
                        View All Contacts
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="No contacts yet"
                  message="Add contacts to start sending campaigns"
                  actionLabel="Add Contacts"
                  onAction={() => window.location.href = '/contacts'}
                  icon={Users}
                />
              )}
            </CardContent>
          </Card>

          {/* API Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                API Usage
              </CardTitle>
              <CardDescription>Your current API usage and limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Requests</span>
                    <span className="font-medium">8,432 / 10,000</span>
                  </div>
                  <Progress value={84} className="h-2" />
                  <div className="text-xs text-gray-500">16% remaining this month</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rate Limit</span>
                    <span className="font-medium">156 / 200 per minute</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  <div className="text-xs text-gray-500">22% capacity remaining</div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href="/api-usage">
                    View Detailed Usage
                    <BarChart3 className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <a href="/templates">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Templates
                </a>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <a href="/api-keys">
                  <Key className="h-4 w-4 mr-2" />
                  API Keys
                </a>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <a href="/help">
                  <Settings className="h-4 w-4 mr-2" />
                  Help & Support
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
