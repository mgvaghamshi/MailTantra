/**
 * Draft service for saving campaign drafts
 */
import { apiClient } from './api-client';
import type { CampaignFormData } from '@/types/campaign';

export interface DraftSaveRequest {
  campaign_id?: string; name?: string;
  subject?: string;
  description?: string;
  template_id?: string;
  custom_content?: string;
  recipients?: string[];
  schedule_type?: string;
  scheduled_at?: string;
  timezone?: string;
  current_step?: number;
  tags?: string[];
  campaign_type?: string;
  skip_template?: boolean;
  // Recurring campaign fields
  recurring_config?: any;
  recurring_start_date?: string;
  recurring_end_date?: string;
  recurring_max_occurrences?: number;
}export interface DraftSaveResponse {
  id: string;
  name: string;
  subject: string;
  description?: string;
  template_id?: string;
  status: string;
  recipients_count: number;
  created_at: string;
  updated_at: string;
  current_step: number;
  is_draft: boolean;
  can_resume: boolean;
}

class DraftService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private loadingRequests = new Map<string, Promise<any>>(); // Track ongoing requests
  private readonly CACHE_DURATION = 30000; // 30 seconds

  /**
   * Save campaign draft with current form data
   */
  async saveDraft(data: Partial<CampaignFormData>, currentStep: number = 1, campaignId?: string): Promise<DraftSaveResponse> {
    const draftData: DraftSaveRequest = {
      campaign_id: campaignId,
      name: data.name,
      subject: data.subject,
      description: data.description,
      template_id: data.templateId,
      custom_content: data.customContent,
      recipients: data.recipients?.map(r => typeof r === 'string' ? r : r.id || r.email) || [],
      schedule_type: data.scheduleType,
      scheduled_at: data.scheduledAt instanceof Date ? data.scheduledAt.toISOString() : data.scheduledAt,
      timezone: data.timezone,
      current_step: currentStep,
      tags: data.tags || [],
      campaign_type: data.type,
      skip_template: data.skipTemplate, // Include skip template flag
      
      // Recurring campaign fields
      recurring_config: data.recurringConfig,
      recurring_start_date: data.recurringStartDate,
      recurring_end_date: data.recurringEndDate,
      recurring_max_occurrences: data.recurringMaxOccurrences
    };

    const response = await apiClient.post('/api/v1/campaigns/save-draft', draftData);
    
    // Clear cache for this campaign when saving
    if (campaignId) {
      this.cache.delete(campaignId);
    }
    
    return response.data;
  }

  /**
   * Get campaign draft by ID for resuming (with caching to prevent duplicates)
   */
  async getDraft(campaignId: string): Promise<any> {
    // Check if there's already a request in progress for this campaign
    if (this.loadingRequests.has(campaignId)) {
      return this.loadingRequests.get(campaignId);
    }

    // Check cache first
    const cached = this.cache.get(campaignId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    // Create and store the request promise
    const requestPromise = this.fetchDraftData(campaignId);
    this.loadingRequests.set(campaignId, requestPromise);
    
    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up the loading request
      this.loadingRequests.delete(campaignId);
    }
  }

  private async fetchDraftData(campaignId: string): Promise<any> {
    const response = await apiClient.get(`/api/v1/campaigns/${campaignId}`);
    
    // Backend returns nested structure: { campaign: {...}, stats: {...} }
    // We need just the campaign data for form conversion
    const draftData = response.data.campaign || response.data;
    
    // Cache the result
    this.cache.set(campaignId, {
      data: draftData,
      timestamp: Date.now()
    });
    
    return draftData;
  }

  /**
   * Convert campaign data back to form data for resuming
   */
  convertToFormData(draftData: any): Partial<CampaignFormData> {
    // Infer schedule type from available data
    let scheduleType: 'immediate' | 'scheduled' | 'recurring' = 'immediate';
    
    // Check if it's a recurring campaign first
    if (draftData.schedule_type === 'recurring' || draftData.recurring_config) {
      scheduleType = 'recurring';
    }
    // If scheduled_at exists and is in the future, it's a scheduled campaign
    else if (draftData.scheduled_at) {
      const scheduledDate = new Date(draftData.scheduled_at);
      if (scheduledDate > new Date()) {
        scheduleType = 'scheduled';
      }
    }
    
    // Parse recurring config if it exists
    let recurringConfig = null;
    if (draftData.recurring_config) {
      try {
        recurringConfig = typeof draftData.recurring_config === 'string' 
          ? JSON.parse(draftData.recurring_config) 
          : draftData.recurring_config;
      } catch (error) {
        console.error('Failed to parse recurring config:', error);
        recurringConfig = null;
      }
    }
    
    return {
      name: draftData.name || '',
      subject: draftData.subject || '',
      description: draftData.description || '',
      templateId: draftData.template_id,
      customContent: draftData.custom_content,
      recipients: draftData.recipients || [],
      scheduleType: scheduleType,
      scheduledAt: draftData.scheduled_at ? new Date(draftData.scheduled_at) : undefined,
      timezone: draftData.timezone || 'UTC',
      tags: draftData.tags || [],
      type: draftData.campaign_type || 'newsletter',
      skipTemplate: draftData.skip_template || false,
      // Recurring campaign fields
      recurringConfig: recurringConfig,
      recurringStartDate: draftData.recurring_start_date,
      recurringEndDate: draftData.recurring_end_date,
      recurringMaxOccurrences: draftData.recurring_max_occurrences
    };
  }  /**
   * Get current step from campaign data
   */
  getCurrentStep(draftData: any): number {
    return draftData.current_step || 1;
  }

  /**
   * Delete draft
   */
  async deleteDraft(campaignId: string): Promise<void> {
    await apiClient.delete(`/api/v1/campaigns/${campaignId}`);
    // Clear cache after deletion
    this.cache.delete(campaignId);
  }

  /**
   * List user's draft campaigns
   */
  async listDrafts(): Promise<any[]> {
    const response = await apiClient.get('/api/v1/campaigns?status=draft');
    return response.data.data || [];
  }

  /**
   * Clear cache for a specific campaign or all campaigns
   */
  clearCache(campaignId?: string): void {
    if (campaignId) {
      this.cache.delete(campaignId);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Check if a campaign is cached
   */
  isCached(campaignId: string): boolean {
    const cached = this.cache.get(campaignId);
    return cached !== undefined && Date.now() - cached.timestamp < this.CACHE_DURATION;
  }
}

export const draftService = new DraftService();
