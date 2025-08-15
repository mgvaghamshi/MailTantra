import { useState, useEffect, useRef, useCallback } from 'react';
import { Campaign, emailTrackerAPI } from '@/lib/emailtracker-api';

interface CampaignPollingOptions {
  campaigns: Campaign[];
  onCampaignUpdate: (updatedCampaign: Campaign) => void;
  pollingInterval?: number; // in milliseconds, default 15s
  enabled?: boolean;
}

interface CampaignPollingState {
  isPolling: boolean;
  lastUpdate: Date | null;
  error: Error | null;
}

/**
 * Custom hook for polling campaign status updates
 * Focuses on scheduled campaigns that might transition to 'sent' status
 */
export const useCampaignPolling = ({
  campaigns,
  onCampaignUpdate,
  pollingInterval = 15000, // 15 seconds
  enabled = true
}: CampaignPollingOptions) => {
  const [state, setState] = useState<CampaignPollingState>({
    isPolling: false,
    lastUpdate: null,
    error: null
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);

  // Get campaigns that need polling (scheduled or sending status)
  const getCampaignsToTrack = useCallback(() => {
    return campaigns.filter(campaign => 
      campaign.status === 'scheduled' || 
      campaign.status === 'sending' ||
      (campaign.status === 'sent' && campaign.sent_at && 
       new Date(campaign.sent_at) > new Date(Date.now() - 60000)) // Recently sent (within 1 min)
    );
  }, [campaigns]);

  // Check for status changes in specific campaigns
  const checkCampaignUpdates = useCallback(async () => {
    if (isPollingRef.current) return; // Prevent concurrent requests
    
    const campaignsToTrack = getCampaignsToTrack();
    if (campaignsToTrack.length === 0) return;

    isPollingRef.current = true;
    setState(prev => ({ ...prev, isPolling: true, error: null }));

    try {
      // Check each campaign individually to avoid unnecessary data transfer
      const updatePromises = campaignsToTrack.map(async (campaign) => {
        try {
          const updatedCampaign = await emailTrackerAPI.getCampaign(campaign.id);
          
          // Check if status or metrics have changed
          const hasStatusChanged = updatedCampaign.status !== campaign.status;
          const hasMetricsChanged = 
            updatedCampaign.sent_count !== campaign.sent_count ||
            updatedCampaign.open_rate !== campaign.open_rate ||
            updatedCampaign.click_rate !== campaign.click_rate ||
            updatedCampaign.sent_at !== campaign.sent_at;

          if (hasStatusChanged || hasMetricsChanged) {
            console.log(`🔄 Campaign ${campaign.id} (${campaign.name}) updated:`, {
              oldStatus: campaign.status,
              newStatus: updatedCampaign.status,
              oldSentCount: campaign.sent_count,
              newSentCount: updatedCampaign.sent_count,
              oldOpenRate: campaign.open_rate,
              newOpenRate: updatedCampaign.open_rate,
              oldClickRate: campaign.click_rate,
              newClickRate: updatedCampaign.click_rate,
              hasStatusChanged,
              hasMetricsChanged
            });
            
            onCampaignUpdate(updatedCampaign);
          }
        } catch (error) {
          console.error(`Failed to update campaign ${campaign.id}:`, error);
          // Don't throw here, continue with other campaigns
        }
      });

      await Promise.allSettled(updatePromises);
      
      setState(prev => ({ 
        ...prev, 
        isPolling: false, 
        lastUpdate: new Date(),
        error: null 
      }));
    } catch (error) {
      console.error('Campaign polling error:', error);
      setState(prev => ({ 
        ...prev, 
        isPolling: false, 
        error: error as Error 
      }));
    } finally {
      isPollingRef.current = false;
    }
  }, [getCampaignsToTrack, onCampaignUpdate]);

  // Start/stop polling based on enabled flag and campaigns to track
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const campaignsToTrack = getCampaignsToTrack();
    
    if (campaignsToTrack.length > 0) {
      // Start polling
      if (!intervalRef.current) {
        console.log(`🔄 Starting campaign polling for ${campaignsToTrack.length} campaigns every ${pollingInterval}ms`, 
          campaignsToTrack.map(c => ({ id: c.id, status: c.status, name: c.name })));
        intervalRef.current = setInterval(checkCampaignUpdates, pollingInterval);
      }
    } else {
      // Stop polling if no campaigns need tracking
      if (intervalRef.current) {
        console.log('⏹️ Stopping campaign polling - no campaigns to track');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, pollingInterval, checkCampaignUpdates, getCampaignsToTrack]);

  // Manual trigger for immediate check
  const triggerUpdate = useCallback(() => {
    checkCampaignUpdates();
  }, [checkCampaignUpdates]);

  return {
    ...state,
    triggerUpdate,
    campaignsBeingTracked: getCampaignsToTrack().length
  };
};
