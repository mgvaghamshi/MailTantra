'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Plus, Filter, BarChart3, Loader2, Lock, RefreshCw, Mail, Edit, Eye, MousePointer, Users, Calendar, Send } from 'lucide-react'
import { useCampaigns } from '@/hooks/use-emailtracker'
import { useAuth } from '@/contexts/auth-context'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Campaign } from '@/lib/emailtracker-api'
import { NewCampaignDialog } from '@/components/new-campaign-dialog'
import { EditCampaignDialog } from '@/components/edit-campaign-dialog'
import { SendCampaignDialog } from '@/components/send-campaign-dialog'
import { ScheduleCampaignDialog } from '@/components/schedule-campaign-dialog'
import { CampaignExport } from '@/components/campaign-export'
import { CampaignsLoadingSkeleton } from '@/components/campaigns/campaign-skeletons'
import Link from 'next/link'
import CampaignTable from '@/components/CampaignTable'

// Simple StatCard component for campaign overview
function StatCard({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'neutral' 
}: { 
  title: string
  value: string | number
  icon: React.ReactNode
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
}) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }
  
  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${changeColors[changeType]}`}>{change}</p>
          )}
        </div>
      </div>
    </Card>
  )
}

export default function CampaignsPage() {
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
              Please log in to view your campaigns
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
      <CampaignsDashboard />
    </AuthGuard>
  );
}

function CampaignsDashboard() {
  const { data: campaigns = [], loading, error, refresh } = useCampaigns()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [sendDialogOpen, setSendDialogOpen] = useState(false)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  
  // Local state for real-time updates
  const [localCampaigns, setLocalCampaigns] = useState<Campaign[]>([])

  // Sync local campaigns with API data
  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      setLocalCampaigns(campaigns)
    }
  }, [campaigns])

  // Handle single campaign updates for real-time changes
  const handleSingleCampaignUpdate = (updatedCampaign: Campaign) => {
    setLocalCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === updatedCampaign.id ? updatedCampaign : campaign
      )
    )
  }

  // Enhanced refresh function that also updates local state
  const handleRefresh = () => {
    refresh().then(() => {
      // Local campaigns will be synced via useEffect when campaigns changes
    })
  }

  // Use real data from API - but prefer local state for real-time updates
  const campaignData = localCampaigns.length > 0 ? localCampaigns : campaigns

  const filteredCampaigns = campaignData?.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not sent'
    return new Date(dateString).toLocaleDateString()
  }

  // Calculate stats
  const totalCampaigns = campaignData?.length || 0
  const draftCampaigns = campaignData?.filter(c => c.status === 'draft').length || 0
  const avgOpenRate = campaignData && campaignData.length > 0 
    ? campaignData.reduce((sum, c) => sum + c.open_rate, 0) / campaignData.length 
    : 0
  const avgClickRate = campaignData && campaignData.length > 0 
    ? campaignData.reduce((sum, c) => sum + c.click_rate, 0) / campaignData.length 
    : 0

  if (loading) {
    return <CampaignsLoadingSkeleton />
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Campaigns</h3>
            <p className="text-gray-600 mb-4 max-w-md">{error}</p>
            <Button onClick={handleRefresh} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div className="space-y-2">
          <p className="text-gray-600 text-lg">
            Create, manage and track your email marketing campaigns with powerful analytics and insights
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/analytics">
            <Button variant="outline" className="w-full sm:w-auto gap-2 h-11 px-6">
              <BarChart3 className="w-4 h-4" />
              View Analytics
            </Button>
          </Link>
          <NewCampaignDialog 
            onCampaignCreated={handleRefresh} 
            buttonClassName="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          />
        </div>
      </header>

        {/* Stats Overview */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Campaign Overview</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="gap-2 text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Campaigns"
              value={totalCampaigns}
              icon={<Mail className="w-5 h-5 text-blue-600" />}
            />
            <StatCard
              title="Draft Campaigns"
              value={draftCampaigns}
              change={draftCampaigns > 0 ? 'Ready to send' : 'No drafts'}
              changeType={draftCampaigns > 0 ? 'positive' : 'neutral'}
              icon={<Edit className="w-5 h-5 text-orange-600" />}
            />
            <StatCard
              title="Average Open Rate"
              value={`${avgOpenRate.toFixed(1)}%`}
              change={avgOpenRate > 20 ? 'Good performance' : 'Room for improvement'}
              changeType={avgOpenRate > 20 ? 'positive' : 'neutral'}
              icon={<Eye className="w-5 h-5 text-green-600" />}
            />
            <StatCard
              title="Average Click Rate"
              value={`${avgClickRate.toFixed(1)}%`}
              change="Average engagement"
              changeType="neutral"
              icon={<MousePointer className="w-5 h-5 text-purple-600" />}
            />
          </div>
        </section>

        {/* Filters and Search */}
        <section className="space-y-6">
          <Card className="p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row flex-1 gap-3 w-full max-w-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search campaigns by name or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-11 min-w-fit transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="sending">Sending</option>
                  <option value="sent">Sent</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <Button variant="outline" className="flex-1 lg:flex-initial gap-2 h-11">
                  <Filter className="w-4 h-4" />
                  Filter & Sort
                </Button>
                <CampaignExport 
                  campaigns={campaignData || []} 
                  filteredCampaigns={filteredCampaigns} 
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Campaigns List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Your Campaigns</h2>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="font-medium">{filteredCampaigns.length} of {totalCampaigns} campaigns</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs">Sent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs">Active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-xs">Draft</span>
                </div>
              </div>
            </div>
          </div>

          {filteredCampaigns.length === 0 ? (
            <Card className="shadow-sm">
              <div className="text-center py-16 px-6">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Mail className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">No campaigns found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {campaignData?.length === 0 
                    ? "Get started by creating your first email campaign to reach your audience." 
                    : "No campaigns match your search criteria. Try adjusting your filters."
                  }
                </p>
                {campaignData?.length === 0 && (
                  <NewCampaignDialog 
                    onCampaignCreated={handleRefresh} 
                    buttonClassName="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    buttonText="Create Your First Campaign"
                  />
                )}
              </div>
            </Card>
          ) : (
            <CampaignTable 
              campaigns={campaignData || []}
              filteredCampaigns={filteredCampaigns}
              onEditCampaign={(campaign) => {
                setEditingCampaign(campaign)
                setEditDialogOpen(true)
              }}
              onSendCampaign={(campaign) => {
                setSelectedCampaign(campaign)
                setSendDialogOpen(true)
              }}
              onScheduleCampaign={(campaign) => {
                setSelectedCampaign(campaign)
                setScheduleDialogOpen(true)
              }}
              onCampaignUpdate={handleRefresh}
              onSingleCampaignUpdate={handleSingleCampaignUpdate}
              enablePolling={true}
            />
          )}
        </section>

        {/* Dialogs */}
        <SendCampaignDialog
          campaign={selectedCampaign}
          open={sendDialogOpen}
          onOpenChange={setSendDialogOpen}
          onSuccess={handleRefresh}
        />

        <ScheduleCampaignDialog
          campaign={selectedCampaign}
          open={scheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
          onSuccess={handleRefresh}
        />

        <EditCampaignDialog
          campaign={editingCampaign}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={handleRefresh}
        />
      </>
    )
  }
