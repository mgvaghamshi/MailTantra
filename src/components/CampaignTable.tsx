import React, { useState, useEffect } from 'react';
import { Campaign } from '@/lib/emailtracker-api';
import { CampaignActionsMenu } from '@/components/campaign-actions-menu';
import { EmailPreviewDialog } from '@/components/email-preview-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCampaignPolling } from '@/hooks/use-campaign-polling';
import { 
  Calendar,
  Users,
  Mail,
  MousePointer,
  Eye,
  Edit,
  Send,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';

interface CampaignTableProps {
  campaigns?: Campaign[];
  filteredCampaigns?: Campaign[];
  onEditCampaign?: (campaign: Campaign) => void;
  onSendCampaign?: (campaign: Campaign) => void;
  onScheduleCampaign?: (campaign: Campaign) => void;
  onCampaignUpdate?: () => void;
  onSingleCampaignUpdate?: (updatedCampaign: Campaign) => void;
  enablePolling?: boolean;
}

const CampaignTable: React.FC<CampaignTableProps> = ({ 
  campaigns = [],
  filteredCampaigns = [],
  onEditCampaign,
  onSendCampaign,
  onScheduleCampaign,
  onCampaignUpdate,
  onSingleCampaignUpdate,
  enablePolling = true
}) => {
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null);
  
  // Set up real-time polling for campaign updates
  const { isPolling, lastUpdate, error: pollingError, campaignsBeingTracked } = useCampaignPolling({
    campaigns: campaigns,
    onCampaignUpdate: (updatedCampaign) => {
      // Call the single campaign update callback if available
      if (onSingleCampaignUpdate) {
        onSingleCampaignUpdate(updatedCampaign);
      } else {
        // Fallback to full refresh if single update not available
        onCampaignUpdate?.();
      }
    },
    pollingInterval: 15000, // 15 seconds
    enabled: enablePolling
  });
  
  // Use the filtered campaigns directly - no more demo data fallback
  const displayCampaigns = filteredCampaigns;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      sent: 'bg-green-100 text-green-800 border-green-200',
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      sending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paused: 'bg-orange-100 text-orange-800 border-orange-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
    };
    
    const className = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge className={`${className} border text-xs font-medium px-2 py-1`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Cap percentage values at 100% maximum
  const formatPercentage = (value: number | undefined) => {
    if (!value) return 0;
    return Math.min(value, 100);
  };

  // Truncate text with ellipsis for display
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getLastSaved = (campaign: Campaign) => {
    const lastSavedAt = campaign.auto_save_data?.last_saved_at || campaign.created_at;
    const now = new Date();
    const updated = new Date(lastSavedAt);
    const diffInMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return updated.toLocaleDateString('en-GB');
  };

  // Get auto-save status
  const getAutoSaveStatus = (campaign: Campaign) => {
    if (campaign.status === 'sent' || campaign.status === 'scheduled') {
      return null; // No auto-save for completed campaigns
    }
    
    return campaign.auto_save_data ? true : false; // Check if auto-save data exists
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not sent';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  };

  return (
    <div className="w-full space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">Campaign Management</h2>
          <p className="text-sm text-gray-600">Monitor and control your email marketing campaigns</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="font-medium text-gray-900">{displayCampaigns.length}</span> 
            <span>campaigns</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span className="font-medium text-gray-900">
              {displayCampaigns.reduce((sum, c) => sum + (c.recipients_count || 0), 0).toLocaleString()}
            </span>
            <span>recipients</span>
          </span>
          
          {/* Real-time status indicator */}
          {enablePolling && campaignsBeingTracked > 0 && (
            <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200">
              {isPolling ? (
                <Wifi className="w-3 h-3 animate-pulse" />
              ) : (
                <Wifi className="w-3 h-3" />
              )}
              <span>
                Live tracking {campaignsBeingTracked} campaign{campaignsBeingTracked !== 1 ? 's' : ''}
              </span>
              {lastUpdate && (
                <span className="text-blue-600 font-medium">
                  • {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          )}
          
          {/* Polling error indicator */}
          {pollingError && (
            <div className="flex items-center gap-1.5 text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-full border border-red-200">
              <WifiOff className="w-3 h-3" />
              <span>Update failed</span>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayCampaigns.map((campaign, index) => (
          <div 
            key={campaign.id} 
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
          >
            {/* Card Header Section */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  {/* Campaign Title */}
                  <h3 
                    className="font-semibold text-gray-900 text-lg leading-6 mb-2 cursor-help group-hover:text-blue-600 transition-colors"
                    title={campaign.name}
                  >
                    {truncateText(campaign.name, 45)}
                  </h3>
                  
                  {/* Subject Line */}
                  <p 
                    className="text-gray-600 text-sm leading-5 mb-2 cursor-help"
                    title={`Subject: ${campaign.subject}`}
                  >
                    <span className="text-gray-500 font-medium">Subject:</span> {truncateText(campaign.subject, 55)}
                  </p>
                </div>
                
                {/* Status Badge */}
                <div className="flex-shrink-0 ml-4">
                  {getStatusBadge(campaign.status)}
                </div>
              </div>
              
              {/* Description */}
              {campaign.description && (
                <div 
                  className="text-gray-500 text-sm leading-5 line-clamp-2 cursor-help"
                  title={campaign.description}
                >
                  {campaign.description}
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className="px-6 pb-4">
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                {/* Primary Stats Row */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Recipients</span>
                    </div>
                    <div className="text-xl font-bold text-blue-900">
                      {campaign.recipients_count?.toLocaleString() || 0}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Sent</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      {campaign.sent_count?.toLocaleString() || 0}
                    </div>
                  </div>
                </div>
                
                {/* Performance Stats Row */}
                <div className="grid grid-cols-2 gap-6 pt-3 border-t border-gray-200">
                  <div 
                    className="text-center cursor-help"
                    title="Open Rate: Percentage of recipients who opened the email"
                  >
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <Eye className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-600 uppercase tracking-wide">Open Rate</span>
                    </div>
                    <div className="text-lg font-bold text-green-700">
                      {formatPercentage(campaign.open_rate)}%
                    </div>
                  </div>
                  
                  <div 
                    className="text-center cursor-help"
                    title="Click Rate: Percentage of recipients who clicked links in the email"
                  >
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <MousePointer className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">Click Rate</span>
                    </div>
                    <div className="text-lg font-bold text-purple-700">
                      {formatPercentage(campaign.click_rate)}%
                    </div>
                  </div>
                </div>
                
                {/* Date Info */}
                <div className="pt-3 border-t border-gray-200 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {campaign.status === 'sent' ? 'Sent' : 
                       campaign.status === 'scheduled' ? 'Scheduled' : 'Created'}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {campaign.status === 'sent' && campaign.sent_at
                      ? formatDate(campaign.sent_at)
                      : campaign.status === 'scheduled' && campaign.scheduled_at
                      ? formatDate(campaign.scheduled_at)
                      : formatDate(campaign.created_at)}
                  </div>
                </div>

                {/* Auto-save Status - Only for Draft campaigns */}
                {campaign.status === 'draft' && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {getAutoSaveStatus(campaign) ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-600 font-medium">Auto-save enabled</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span className="text-gray-500 font-medium">Auto-save disabled</span>
                          </>
                        )}
                      </div>
                      <span className="text-gray-500">
                        {getLastSaved(campaign)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Section */}
            <div className="px-6 pb-6">
              {/* Primary Actions */}
              <div className="flex flex-wrap gap-3 mb-4">
                {/* Send Button - Only for Draft campaigns */}
                {campaign.status === 'draft' && onSendCampaign && (
                  <Button
                    onClick={() => onSendCampaign(campaign)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium h-10 transition-colors"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Now
                  </Button>
                )}
                
                {/* Schedule Button - Only for Draft campaigns */}
                {campaign.status === 'draft' && onScheduleCampaign && (
                  <Button
                    variant="outline"
                    onClick={() => onScheduleCampaign(campaign)}
                    className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 font-medium h-10 transition-colors"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                )}
                
                {/* If not draft, show status message */}
                {campaign.status !== 'draft' && (
                  <div className="flex-1 text-center py-3 text-sm text-gray-500 bg-gray-50 rounded-lg border">
                    {campaign.status === 'sent' ? '✅ Campaign Sent' : 
                     campaign.status === 'scheduled' ? '⏰ Campaign Scheduled' : 
                     campaign.status === 'sending' ? '📤 Sending...' : 
                     `Status: ${campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}`}
                  </div>
                )}
              </div>
              
              {/* Secondary Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Preview Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setPreviewCampaign(campaign)}
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    Preview
                  </Button>
                  
                  {/* Edit Button */}
                  {onEditCampaign && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEditCampaign(campaign)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1.5" />
                      Edit
                    </Button>
                  )}
                </div>
                
                {/* More Actions Dropdown */}
                <CampaignActionsMenu
                  campaign={campaign}
                  onCampaignUpdate={onCampaignUpdate || (() => {})}
                  className="inline-flex"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {displayCampaigns.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">No campaigns found</h3>
          <p className="text-gray-500 max-w-md mx-auto">Create your first email campaign to start reaching your audience with targeted messaging.</p>
        </div>
      )}

      {/* Summary Footer */}
      <Card className="p-4 bg-gray-50 border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
          <div className="mb-2 sm:mb-0">
            <span className="font-medium text-gray-900">{displayCampaigns.length}</span> campaigns total
          </div>
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span className="font-medium text-gray-900">
                {displayCampaigns.reduce((sum, c) => sum + (c.recipients_count || 0), 0).toLocaleString()}
              </span>
              <span>total recipients</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              <span className="font-medium text-gray-900">
                {displayCampaigns.reduce((sum, c) => sum + (c.sent_count || 0), 0).toLocaleString()}
              </span>
              <span>emails sent</span>
            </span>
          </div>
        </div>
      </Card>

      {/* Email Preview Dialog */}
      {previewCampaign && (
        <EmailPreviewDialog
          campaign={previewCampaign}
          open={!!previewCampaign}
          onOpenChange={(open) => !open && setPreviewCampaign(null)}
        />
      )}
    </div>
  );
};

export default CampaignTable;
