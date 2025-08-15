// EmailTracker API client
import { apiClient } from './api-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_EMAILTRACKER_API_URL || 'http://localhost:8000';
const API_KEY = process.env.NEXT_PUBLIC_EMAILTRACKER_API_KEY;

export interface EmailTracker {
  id: string;
  campaign_id: string;
  recipient_email: string;
  sender_email: string;
  subject: string;
  delivered: boolean;
  bounced: boolean;
  complained: boolean;
  unsubscribed: boolean;
  open_count: number;
  click_count: number;
  unique_opens: number;
  unique_clicks: number;
  created_at: string;
  sent_at?: string;
  delivered_at?: string;
  opened_at?: string;
  first_click_at?: string;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  description?: string;
  template_id?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  recipients_count: number;
  sent_count: number;
  open_rate: number;
  click_rate: number;
  created_at: string;
  sent_at?: string;
  scheduled_at?: string;
  
  // Premium Features
  is_ab_test?: boolean;
  ab_test_config?: ABTestConfig;
  auto_save_data?: AutoSaveData;
  template_assignments?: TemplateAssignment[];
  version?: number;
  parent_campaign_id?: string; // For versioning/cloning
  premium_tier_required?: 'basic' | 'premium' | 'enterprise';
}

export interface ABTestConfig {
  id: string;
  variations: ABTestVariation[];
  split_percentage: number; // 50 = 50/50 split
  test_duration_hours: number; // Auto-select winner after N hours
  winner_metric: 'open_rate' | 'click_rate' | 'conversion_rate';
  auto_select_winner: boolean;
  status: 'running' | 'completed' | 'paused';
  winner_variation_id?: string;
  started_at?: string;
  completed_at?: string;
}

export interface ABTestVariation {
  id: string;
  name: string; // "Version A", "Version B"
  subject?: string;
  html_content?: string;
  send_time_offset?: number; // Minutes offset from main campaign
  recipients_assigned: number;
  metrics: {
    sent: number;
    opened: number;
    clicked: number;
    open_rate: number;
    click_rate: number;
  };
}

export interface AutoSaveData {
  last_saved_at: string;
  draft_content: {
    name?: string;
    subject?: string;
    html_content?: string;
    text_content?: string;
    description?: string;
  };
  auto_save_enabled: boolean;
  save_interval_seconds: number; // Default 15 seconds
}

export interface TemplateAssignment {
  id: string;
  template_id: string;
  template_name?: string; // For display purposes
  campaign_id?: string; // For tracking
  assignment_type?: 'primary' | 'fallback'; // Type of assignment
  is_active?: boolean; // Whether assignment is active
  segment_rule: SegmentRule;
  priority: number; // Lower number = higher priority
  template_preview_url?: string;
}

export interface SegmentRule {
  id: string;
  name: string;
  conditions: SegmentCondition[];
  logic: 'AND' | 'OR';
}

export interface SegmentCondition {
  field: string; // 'tags', 'custom_fields.vip_status', 'email_domain'
  operator: 'equals' | 'contains' | 'not_equals' | 'in' | 'not_in';
  value: string | string[];
}

export interface CampaignDeliveryLog {
  recipient_email: string;
  status: 'delivered' | 'bounced' | 'sent' | 'pending';
  events: DeliveryEvent[];
  delivery_stats: {
    sent: boolean;
    delivered: boolean;
    opened: boolean;
    clicked: boolean;
    bounced: boolean;
    open_count: number;
    click_count: number;
  };
  timestamps: {
    sent_at?: string;
    delivered_at?: string;
    opened_at?: string;
    first_click_at?: string;
  };
}

export interface DeliveryEvent {
  type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced';
  timestamp: string;
  status: 'completed' | 'failed';
  count?: number;
  reason?: string;
}

export interface CampaignDeliveryResponse {
  logs: CampaignDeliveryLog[];
  total: number;
  offset: number;
  limit: number;
  campaign_id: string;
  summary: {
    total_recipients: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
  };
}

export interface CampaignVersion {
  id: string;
  campaign_id: string;
  version_number: number;
  changes_summary: string;
  created_at: string;
  created_by: string;
  snapshot_data: Partial<Campaign>;
}

export interface EmailPreview {
  html_content: string;
  text_content: string;
  personalized_content: {
    html: string;
    text: string;
    sample_data: { [key: string]: string };
  };
  mobile_preview: string;
  desktop_preview: string;
  preview_urls: {
    mobile: string;
    desktop: string;
    email_client: string;
  };
}

export interface Contact {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  tags?: string[];
  custom_fields?: { [key: string]: string | number | boolean | null };
  created_at: string;
  updated_at: string;
  last_activity?: string;
}

export interface ApiKeyData {
  id: string;
  name: string;
  key?: string; // Only present when creating a new key
  user_id?: string;
  is_active: boolean;
  created_at: string;
  last_used_at?: string;
  expires_at?: string;
  requests_per_minute: number;
  requests_per_day: number;
}

// Separate interface for creating API keys (includes the key)
export interface ApiKeyCreateResponse extends ApiKeyData {
  key: string; // Always present in creation response
}

// Interface for listing API keys (never includes the key)
export type ApiKeyListItem = Omit<ApiKeyData, 'key'>;

export interface ApiKeyUsageStats {
  api_key_id: string;
  current_minute_requests: number;
  current_day_requests: number;
  limit_minute: number;
  limit_day: number;
  remaining_minute: number;
  remaining_day: number;
}

export interface Analytics {
  total_emails_sent: number;
  total_opens: number;
  total_clicks: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number;
  period: string;
}

export interface DashboardAnalytics {
  // Overall analytics metrics
  total_campaigns: number;
  total_emails_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  total_bounced: number;
  total_unsubscribed: number;
  total_opens: number;  // Total opens (including repeated)
  total_clicks: number; // Total clicks (including repeated)
  
  // Calculated rates
  overall_open_rate: number;
  overall_click_rate: number;
  overall_bounce_rate: number;
  overall_unsubscribe_rate: number;
  
  // Recent campaigns list
  recent_campaigns: Array<{
    id: string;
    name: string;
    status: string;
    created_at: string;
    emails_sent: number;
    open_rate: number;
    click_rate: number;
  }>;
}

export interface HistoricalAnalytics {
  current_month: {
    total_campaigns: number;
    total_emails_sent: number;
    total_delivered: number;
    total_opened: number;
    total_clicked: number;
    overall_open_rate: number;
    overall_click_rate: number;
  };
  previous_month: {
    total_campaigns: number;
    total_emails_sent: number;
    total_delivered: number;
    total_opened: number;
    total_clicked: number;
    overall_open_rate: number;
    overall_click_rate: number;
  };
  month_over_month: {
    campaigns_change: number;
    emails_change: number;
    delivered_change: number;
    open_rate_change: number;
    click_rate_change: number;
  };
}

export interface Template {
  id: string;
  api_key_id: string;
  name: string;
  type: 'newsletter' | 'promotional' | 'transactional' | 'welcome';
  status: 'draft' | 'published' | 'archived';
  subject?: string;
  html_content?: string;
  text_content?: string;
  description?: string;
  thumbnail_url?: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
  // Premium features
  folder_id?: string;
  folder?: TemplateFolder; // Populated folder relationship
  tags?: string[];
  tags_array?: string[]; // Computed field from backend
  version_number?: number;
  is_locked?: boolean;
  locked_by?: string;
  locked_at?: string;
  is_system?: boolean;
  is_premium?: boolean;
  category?: string;
  industry?: string;
  preview_images?: string[];
  content_blocks?: any[];
  variables?: string[];
  personalization_fields?: string[];
  ab_test_id?: string;
  ab_variant?: string;
  performance_score?: number;
}

export interface TemplateCreate {
  name: string;
  type: 'newsletter' | 'promotional' | 'transactional' | 'welcome';
  status?: 'draft' | 'published' | 'archived';
  subject?: string;
  html_content?: string;
  text_content?: string;
  description?: string;
  thumbnail_url?: string;
  // Premium features
  folder_id?: string;
  tags?: string[];
  ab_test_id?: string;
  ab_variant?: string;
}

export interface TemplateUpdate {
  name?: string;
  type?: 'newsletter' | 'promotional' | 'transactional' | 'welcome';
  status?: 'draft' | 'published' | 'archived';
  subject?: string;
  html_content?: string;
  text_content?: string;
  description?: string;
  thumbnail_url?: string;
  // Premium features
  folder_id?: string;
  tags?: string[];
  is_locked?: boolean;
}

export interface TemplateList {
  templates: Template[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface TemplateStats {
  total_templates: number;
  published_templates: number;
  draft_templates: number;
  archived_templates: number;
  most_used_template?: {
    id: string;
    name: string;
    usage_count: number;
  };
}

// Premium template features interfaces
export interface TemplateVersion {
  id: string;
  template_id: string;
  version_number: number;
  changes_summary: string;
  created_at: string;
  created_by: string;
  snapshot_data: any;
}

export interface TemplateABTest {
  id: string;
  name: string;
  template_ids: string[];
  status: 'draft' | 'running' | 'completed';
  traffic_split: number[];
  winner_criteria: string;
  winner_template_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SystemTemplate {
  id: string;
  name: string;
  category: string;
  industry: string;
  type: string;
  description: string;
  thumbnail_url: string;
  preview_images: string[];
  html_content: string;
  text_content?: string;
  variables: string[];
  tags: string[];
  tags_array?: string[]; // Computed field from backend
  usage_count: number;
  rating: number;
  is_premium: boolean;
}

export interface TemplateCreatePremium extends TemplateCreate {
  folder_id?: string;
  tags?: string[];
  ab_test_id?: string;
  ab_variant?: string;
}

export interface TemplateUpdatePremium extends TemplateUpdate {
  folder_id?: string;
  tags?: string[];
  is_locked?: boolean;
}

export interface TemplateFolder {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  user_id: string;
  template_count?: number;
  created_at: string;
  updated_at: string;
}

export interface TemplateFolderCreate {
  name: string;
  description?: string;
  parent_id?: string;
}

export interface TemplateFolderUpdate {
  name?: string;
  description?: string;
  parent_id?: string;
}

// Settings Interfaces
export interface SmtpSettings {
  server: string;
  port: number;
  security: 'TLS' | 'SSL' | 'NONE';
  username: string;
  password: string;
  isConnected?: boolean;
}

export interface SmtpTestResponse {
  success: boolean;
  error?: string;
}

export interface CompanySettings {
  company_name: string;
  company_website: string;
  company_logo: string;
  company_address: string;
  support_email: string;
  privacy_policy_url: string;
  terms_of_service_url: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorVerified: boolean;
  backupCodesRemaining: number;
  apiKeyRotationEnabled: boolean;
  sessionTimeout: number;
  lastTwoFactorUsed: string | null;
}

interface TwoFactorStatus {
  is_enabled: boolean;
  is_verified: boolean;
  backup_codes_remaining: number;
  setup_completed_at: string | null;
  last_used_at: string | null;
}

interface TwoFactorSetup {
  secret: string;
  qr_code_url: string;
  backup_codes: string[];
  setup_uri: string;
}

interface TwoFactorVerifyResponse {
  success: boolean;
  message: string;
  backup_codes_remaining?: number;
}

interface TwoFactorLoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  backup_codes_remaining?: number;
}

interface TwoFactorBackupCodes {
  backup_codes: string[];
  message: string;
}

export interface NotificationSettings {
  campaignCompletion: boolean;
  highBounceRate: boolean;
  apiLimitWarnings: boolean;
  securityAlerts: boolean;
  weeklyReports: boolean;
  webhookUrl?: string;
  emailNotifications: boolean;
}

export interface StorageData {
  used: number;
  total: number;
  campaigns: number;
  contacts: number;
  emailsSent: number;
  retentionPeriod: number;
  lastBackup?: string;
  autoBackup: boolean;
}

export interface DomainSettings {
  trackingDomain: string;
  sendingDomain: string;
}

export interface DomainStatus {
  spf: 'verified' | 'pending' | 'failed';
  dkim: 'verified' | 'pending' | 'failed';
}

class EmailTrackerAPI {
  private baseURL: string;
  private fallbackApiKey: string;
  private rateLimitCallback?: (response: Response) => void;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.fallbackApiKey = API_KEY || '';
  }

  private getCurrentToken(): string {
    // For dashboard routes, use JWT token from logged-in user
    const jwtToken = apiClient.getAccessToken();
    if (jwtToken) {
      return jwtToken;
    }
    
    // For external API routes, fall back to EmailTracker API key
    const userApiKey = apiClient.getEmailTrackerApiKey();
    if (userApiKey) {
      return userApiKey;
    }
    
    // Final fallback to environment variable API key
    return this.fallbackApiKey || '';
  }

  setRateLimitCallback(callback: (response: Response) => void) {
    this.rateLimitCallback = callback;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getCurrentToken()}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Always update rate limit info from response headers
      if (this.rateLimitCallback) {
        this.rateLimitCallback(response);
      }

      if (!response.ok) {
        if (response.status === 429) {
          const errorData = await response.json().catch(() => ({ 
            detail: 'Rate limit exceeded. Please wait before making more requests or upgrade your plan.' 
          }));
          
          // Throw a specific rate limit error
          const error = new Error(errorData.detail) as Error & { status: number; rateLimited: boolean };
          error.status = 429;
          error.rateLimited = true;
          throw error;
        }

        // Try to parse error response for more detailed error message
        try {
          const errorText = await response.text();
          if (errorText) {
            const errorData = JSON.parse(errorText);
            if (errorData.detail) {
              throw new Error(`${response.status}: ${errorData.detail}`);
            }
          }
        } catch (parseError) {
          // If parsing fails, fall back to generic error
        }

        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      // Handle 204 No Content responses (common for DELETE requests)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null as T;
      }

      // Check if response has content
      const text = await response.text();
      if (!text) {
        return null as T;
      }

      return JSON.parse(text);
    } catch (error) {
      console.error('EmailTracker API Error:', error);
      throw error;
    }
  }

  // Email Tracking
  async getEmailTrackers(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<EmailTracker[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    
    const endpoint = `/api/v1/emails/trackers${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.request<EmailTracker[]>(endpoint);
  }

  async getEmailTracker(id: string): Promise<EmailTracker> {
    return this.request<EmailTracker>(`/api/v1/emails/trackers/${id}`);
  }

  // Campaign Management
  async getCampaigns(): Promise<Campaign[]> {
    const response = await this.request<{ data: Campaign[] }>('/api/v1/campaigns');
    return response.data || [];
  }

  async getCampaign(id: string): Promise<Campaign> {
    return this.request<Campaign>(`/api/v1/campaigns/${id}`);
  }

  async createCampaign(campaign: Partial<Campaign>): Promise<Campaign> {
    return this.request<Campaign>('/api/v1/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaign),
    });
  }

  async updateCampaign(id: string, campaign: Partial<Campaign>): Promise<Campaign> {
    return this.request<Campaign>(`/api/v1/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaign),
    });
  }

  async deleteCampaign(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/v1/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  // Campaign Send & Schedule Methods
  async sendCampaign(id: string): Promise<{ 
    success: boolean;
    message: string; 
    campaign_id: string;
    status: string;
    sent_count?: number;
    error?: string;
  }> {
    return this.request<{ 
      success: boolean;
      message: string; 
      campaign_id: string;
      status: string;
      sent_count?: number;
      error?: string;
    }>(`/api/v1/campaigns/${id}/send`, {
      method: 'POST',
    });
  }

  async scheduleCampaign(id: string, scheduled_at: string, timezone?: string): Promise<{ 
    message?: string;
    success?: boolean;
    campaign_id: string;
    status: string;
    scheduled_at: string;
    scheduled_at_utc?: string;
    scheduled_at_user_timezone?: string;
    timezone?: string;
    utc_offset?: string;
    error?: string;
  }> {
    return this.request<{ 
      message?: string;
      success?: boolean;
      campaign_id: string;
      status: string;
      scheduled_at: string;
      scheduled_at_utc?: string;
      scheduled_at_user_timezone?: string;
      timezone?: string;
      utc_offset?: string;
      error?: string;
    }>(`/api/v1/campaigns/${id}/schedule`, {
      method: 'POST',
      body: JSON.stringify({ 
        scheduled_at, 
        timezone: timezone || 'UTC' 
      }),
    });
  }

  async cancelScheduledCampaign(id: string): Promise<{ 
    success: boolean;
    message: string; 
    campaign_id: string;
    status: string;
    error?: string;
  }> {
    return this.request<{ 
      success: boolean;
      message: string; 
      campaign_id: string;
      status: string;
      error?: string;
    }>(`/api/v1/campaigns/${id}/cancel-schedule`, {
      method: 'POST',
    });
  }

  // Premium Campaign Features
  async createABTest(campaignId: string, config: Partial<ABTestConfig>): Promise<ABTestConfig> {
    return this.request<ABTestConfig>(`/api/v1/campaigns/${campaignId}/ab-test`, {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }

  async getABTestResults(campaignId: string): Promise<ABTestConfig> {
    return this.request<ABTestConfig>(`/api/v1/campaigns/${campaignId}/ab-test`);
  }

  async selectABTestWinner(campaignId: string, variationId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/v1/campaigns/${campaignId}/ab-test/winner`, {
      method: 'POST',
      body: JSON.stringify({ variation_id: variationId })
    });
  }

  async getEmailPreview(campaignId: string, variationId?: string): Promise<EmailPreview> {
    const url = variationId 
      ? `/api/v1/campaigns/${campaignId}/preview?variation_id=${variationId}`
      : `/api/v1/campaigns/${campaignId}/preview`;
    return this.request<EmailPreview>(url);
  }

  async getCampaignLogs(campaignId: string, filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<CampaignDeliveryResponse> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    
    return this.request<CampaignDeliveryResponse>(
      `/api/v1/campaigns/${campaignId}/logs?${params.toString()}`
    );
  }

  async autoSaveCampaign(campaignId: string, draftData: Partial<Campaign>): Promise<{ success: boolean; saved_at: string }> {
    return this.request<{ success: boolean; saved_at: string }>(`/api/v1/campaigns/${campaignId}/auto-save`, {
      method: 'POST',
      body: JSON.stringify({ draft_data: draftData })
    });
  }

  async getAutoSaveData(campaignId: string): Promise<AutoSaveData> {
    return this.request<AutoSaveData>(`/api/v1/campaigns/${campaignId}/auto-save`);
  }

  async cloneCampaign(campaignId: string, newName?: string): Promise<Campaign> {
    return this.request<Campaign>(`/api/v1/campaigns/${campaignId}/clone`, {
      method: 'POST',
      body: JSON.stringify({ name: newName })
    });
  }

  async getCampaignVersions(campaignId: string): Promise<CampaignVersion[]> {
    return this.request<CampaignVersion[]>(`/api/v1/premium/campaigns/${campaignId}/versions`);
  }

  async getCampaignVersion(campaignId: string, versionId: string): Promise<CampaignVersion> {
    return this.request<CampaignVersion>(`/api/v1/premium/campaigns/${campaignId}/versions/${versionId}`);
  }

  async restoreCampaignVersion(campaignId: string, versionId: string): Promise<Campaign> {
    return this.request<Campaign>(`/api/v1/premium/campaigns/${campaignId}/restore-version/${versionId}`, {
      method: 'POST'
    });
  }

  async rollbackCampaign(campaignId: string, versionId: string): Promise<Campaign> {
    return this.request<Campaign>(`/api/v1/premium/campaigns/${campaignId}/rollback/${versionId}`, {
      method: 'POST',
      body: JSON.stringify({ version_id: versionId })
    });
  }

  async assignTemplates(campaignId: string, assignments: TemplateAssignment[]): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/v1/campaigns/${campaignId}/templates`, {
      method: 'POST',
      body: JSON.stringify({ assignments })
    });
  }

  async validateTemplateAssignments(campaignId: string): Promise<{ 
    valid: boolean; 
    errors: string[]; 
    coverage_percentage: number;
  }> {
    return this.request<{ 
      valid: boolean; 
      errors: string[]; 
      coverage_percentage: number;
    }>(`/api/v1/campaigns/${campaignId}/templates/validate`);
  }

  async sendEmail(data: {
    to_email: string;
    from_email: string;
    from_name?: string;
    subject: string;
    html_content?: string;
    text_content?: string;
    campaign_id?: string;
  }): Promise<{ 
    success: boolean;
    message: string; 
    tracker_id: string;
    campaign_id: string;
    status: string;
    error?: string;
  }> {
    return this.request<{ 
      success: boolean;
      message: string; 
      tracker_id: string;
      campaign_id: string;
      status: string;
      error?: string;
    }>('/api/v1/emails/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Analytics
  async getAnalytics(period: string = '7d'): Promise<Analytics> {
    return this.request<Analytics>(`/api/v1/analytics/overview?period=${period}`);
  }

  async getOpenStats(): Promise<{ dates: string[]; opens: number[] }> {
    return this.request<{ dates: string[]; opens: number[] }>('/api/v1/analytics/opens');
  }

  async getClickStats(): Promise<{ dates: string[]; clicks: number[] }> {
    return this.request<{ dates: string[]; clicks: number[] }>('/api/v1/analytics/clicks');
  }

  // Contacts
  async getContacts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<{ data: Contact[]; total: number; page: number; limit: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    
    const endpoint = `/api/v1/contacts${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.request<{ data: Contact[]; total: number; page: number; limit: number }>(endpoint);
  }

  async addContact(contact: Partial<Contact>): Promise<Contact> {
    return this.request<Contact>('/api/v1/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  async updateContact(id: string, contact: Partial<Contact>): Promise<Contact> {
    return this.request<Contact>(`/api/v1/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contact),
    });
  }

  async deleteContact(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/v1/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkDeleteContacts(ids: string[]): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/v1/contacts/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  }

  async exportContacts(filters?: {
    status?: string;
    search?: string;
    ids?: string[];
  }): Promise<Blob> {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.ids) queryParams.append('ids', filters.ids.join(','));
    
    const endpoint = `/api/v1/contacts/export${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getCurrentToken()}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }
    
    return response.blob();
  }

  async importContacts(file: File): Promise<{ 
    imported: number; 
    errors: Array<{ row: number; error: string }> 
  }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${this.baseURL}/api/v1/contacts/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getCurrentToken()}`,
        // Don't set Content-Type for FormData - browser will set it automatically
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Import failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  // Analytics
  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    return this.request<DashboardAnalytics>('/api/v1/analytics/dashboard');
  }

  async getHistoricalAnalytics(): Promise<HistoricalAnalytics> {
    return this.request<HistoricalAnalytics>('/api/v1/analytics/historical');
  }

  async getCampaignAnalytics(campaignId: string): Promise<Analytics> {
    return this.request<Analytics>(`/api/v1/analytics/campaigns/${campaignId}`);
  }

  async getDeliverabilityStats(): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>('/api/v1/analytics/deliverability');
  }

  async getCampaignEngagement(campaignId: string): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>(`/api/v1/analytics/campaigns/${campaignId}/engagement`);
  }

  async getTopLinks(campaignId: string): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>(`/api/v1/analytics/campaigns/${campaignId}/top-links`);
  }

  async getAnalyticsSummary(): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>('/api/v1/analytics/summary');
  }

  // API Keys
  async getApiKeys(): Promise<ApiKeyListItem[]> {
    const response = await this.request<ApiKeyListItem[]>('/api/v1/auth/api-keys');
    return response || [];
  }

  async createApiKey(data: {
    name: string;
    user_id?: string;
    requests_per_minute?: number;
    requests_per_day?: number;
    expires_in_days?: number;
  }): Promise<ApiKeyCreateResponse> {
    return this.request<ApiKeyCreateResponse>('/api/v1/auth/api-keys', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        user_id: data.user_id,
        requests_per_minute: data.requests_per_minute || 100,
        requests_per_day: data.requests_per_day || 10000,
        expires_in_days: data.expires_in_days
      }),
    });
  }

  async deleteApiKey(id: string): Promise<void> {
    await this.request<void>(`/api/v1/auth/api-keys/${id}`, {
      method: 'DELETE',
    });
  }

  async getApiKeyUsage(id: string): Promise<ApiKeyUsageStats> {
    return this.request<ApiKeyUsageStats>(`/api/v1/auth/api-keys/${id}/usage`);
  }

  async getAggregateApiUsage(): Promise<{
    total_requests_this_month: number;
    total_monthly_limit: number;
    usage_percentage: number;
    api_keys_count: number;
    most_used_endpoints: Array<{
      endpoint: string;
      requests: number;
    }>;
  }> {
    return this.request(`/api/v1/auth/api-keys/usage/summary`);
  }

  // Template Management
  async getTemplates(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    search?: string;
    folder_id?: string;
    include_system?: boolean;
  }): Promise<TemplateList> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('skip', String((params.page - 1) * (params.limit || 50)));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.type) searchParams.append('type', params.type);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.folder_id) searchParams.append('folder_id', params.folder_id);
    if (params?.include_system !== undefined) searchParams.append('include_system', String(params.include_system));

    const url = `/api/v1/templates${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<TemplateList>(url);
  }

  async getTemplate(id: string): Promise<Template> {
    return this.request<Template>(`/api/v1/templates/${id}`);
  }

  async createTemplate(data: TemplateCreate): Promise<Template> {
    return this.request<Template>('/api/v1/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTemplate(id: string, data: TemplateUpdate): Promise<Template> {
    return this.request<Template>(`/api/v1/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTemplate(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/v1/templates/${id}`, {
      method: 'DELETE',
    });
  }

  async duplicateTemplate(id: string): Promise<Template> {
    return this.request<Template>(`/api/v1/templates/${id}/duplicate`, {
      method: 'POST',
    });
  }

  async getTemplateStats(): Promise<TemplateStats> {
    return this.request<TemplateStats>('/api/v1/templates/stats');
  }

  // Premium Template Features
  
  // Template Folders
  async getTemplateFolders(): Promise<TemplateFolder[]> {
    const response = await this.request<{folders: TemplateFolder[]}>('/api/v1/templates/folders');
    return response.folders || [];
  }

  async createTemplateFolder(data: TemplateFolderCreate): Promise<TemplateFolder> {
    return this.request<TemplateFolder>('/api/v1/templates/folders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTemplateFolder(id: string, data: TemplateFolderUpdate): Promise<TemplateFolder> {
    return this.request<TemplateFolder>(`/api/v1/templates/folders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTemplateFolder(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/v1/templates/folders/${id}`, {
      method: 'DELETE',
    });
  }

  // Template Versioning
  async getTemplateVersions(templateId: string): Promise<TemplateVersion[]> {
    return this.request<TemplateVersion[]>(`/api/v1/templates/${templateId}/versions`);
  }

  async createTemplateVersion(templateId: string, data: { changes_summary: string }): Promise<TemplateVersion> {
    return this.request<TemplateVersion>(`/api/v1/templates/${templateId}/versions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async restoreTemplateVersion(templateId: string, versionId: string): Promise<Template> {
    return this.request<Template>(`/api/v1/templates/${templateId}/versions/${versionId}/restore`, {
      method: 'POST',
    });
  }

  // Template Locking
  async lockTemplate(templateId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/v1/templates/${templateId}/lock`, {
      method: 'POST',
    });
  }

  async unlockTemplate(templateId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/v1/templates/${templateId}/unlock`, {
      method: 'POST',
    });
  }

  // A/B Testing
  async getTemplateABTests(): Promise<TemplateABTest[]> {
    return this.request<TemplateABTest[]>('/api/v1/templates/ab-tests');
  }

  async createTemplateABTest(data: {
    name: string;
    template_ids: string[];
    traffic_split: number[];
    winner_criteria: string;
  }): Promise<TemplateABTest> {
    return this.request<TemplateABTest>('/api/v1/templates/ab-tests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTemplateABTest(id: string, data: Partial<TemplateABTest>): Promise<TemplateABTest> {
    return this.request<TemplateABTest>(`/api/v1/templates/ab-tests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTemplateABTest(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/v1/templates/ab-tests/${id}`, {
      method: 'DELETE',
    });
  }

  // System Templates
  async getSystemTemplates(params?: {
    category?: string;
    industry?: string;
    type?: string;
    tags?: string[];
    is_premium?: boolean;
  }): Promise<SystemTemplate[]> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.industry) searchParams.append('industry', params.industry);
    if (params?.type) searchParams.append('type', params.type);
    if (params?.tags) params.tags.forEach(tag => searchParams.append('tags', tag));
    if (params?.is_premium !== undefined) searchParams.append('is_premium', String(params.is_premium));

    const url = `/api/v1/templates/system${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<SystemTemplate[]>(url);
  }

  async getSystemTemplate(id: string): Promise<SystemTemplate> {
    return this.request<SystemTemplate>(`/api/v1/templates/system/${id}`);
  }

  async createTemplateFromSystem(systemTemplateId: string, data?: {
    name?: string;
    folder_id?: string;
  }): Promise<Template> {
    return this.request<Template>(`/api/v1/templates/system/${systemTemplateId}/copy`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  // Template Tags
  async updateTemplateTags(templateId: string, tags: string[]): Promise<Template> {
    return this.request<Template>(`/api/v1/templates/${templateId}/tags`, {
      method: 'PUT',
      body: JSON.stringify({ tags }),
    });
  }

  async getTemplateTags(): Promise<string[]> {
    return this.request<string[]>('/api/v1/templates/tags');
  }

  // Check and setup default templates
  async checkDefaultTemplates(): Promise<{
    has_defaults: boolean;
    default_count: number;
    user_templates: number;
    default_templates: Array<{
      id: string;
      name: string;
      type: string;
      status: string;
      created_at: string;
      is_system: boolean;
    }>;
    needs_setup: boolean;
    setup_url: string;
  }> {
    return this.request('/api/v1/templates/check-defaults');
  }

  async setupDefaultTemplates(): Promise<{
    message: string;
    created: number;
    template_ids?: string[];
    template_names?: string[];
    existing?: number;
  }> {
    return this.request('/api/v1/templates/setup-defaults', {
      method: 'POST',
    });
  }

  // ============================================================================
  // Settings API Methods
  // ============================================================================

  // SMTP Settings
  async getSmtpSettings(): Promise<SmtpSettings> {
    return this.request<SmtpSettings>('/api/v1/settings/smtp');
  }

  async updateSmtpSettings(settings: SmtpSettings): Promise<SmtpSettings> {
    return this.request<SmtpSettings>('/api/v1/settings/smtp', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async testSmtpConnection(settings: SmtpSettings): Promise<SmtpTestResponse> {
    return this.request<SmtpTestResponse>('/api/v1/settings/smtp/test', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  // Company Settings
  async getCompanySettings(): Promise<CompanySettings> {
    return this.request<CompanySettings>('/api/v1/settings/company');
  }

  async updateCompanySettings(settings: CompanySettings): Promise<CompanySettings> {
    return this.request<CompanySettings>('/api/v1/settings/company', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Security Settings
  async getSecuritySettings(): Promise<SecuritySettings> {
    return this.request<SecuritySettings>('/api/v1/settings/security');
  }

  async toggle2FA(enabled: boolean): Promise<{ enabled: boolean }> {
    return this.request<{ enabled: boolean }>('/api/v1/settings/security/2fa', {
      method: 'POST',
      body: JSON.stringify({ enabled }),
    });
  }

  async toggleApiKeyRotation(enabled: boolean): Promise<{ enabled: boolean }> {
    return this.request<{ enabled: boolean }>('/api/v1/settings/security/api-rotation', {
      method: 'POST',
      body: JSON.stringify({ enabled }),
    });
  }

  async updateSessionTimeout(timeout: number): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/v1/settings/security/session-timeout', {
      method: 'PUT',
      body: JSON.stringify({ timeout }),
    });
  }

  // Two-Factor Authentication
  async get2FAStatus(): Promise<TwoFactorStatus> {
    return this.request<TwoFactorStatus>('/api/v1/auth/2fa/status');
  }

  async setup2FA(): Promise<TwoFactorSetup> {
    return this.request<TwoFactorSetup>('/api/v1/auth/2fa/setup', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  async verify2FASetup(code: string): Promise<TwoFactorVerifyResponse> {
    return this.request<TwoFactorVerifyResponse>('/api/v1/auth/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  async verify2FALogin(code: string, sessionToken: string): Promise<TwoFactorLoginResponse> {
    return this.request<TwoFactorLoginResponse>('/api/v1/auth/2fa/login', {
      method: 'POST',
      body: JSON.stringify({ code, session_token: sessionToken }),
    });
  }

  async disable2FA(password: string, code?: string): Promise<TwoFactorVerifyResponse> {
    return this.request<TwoFactorVerifyResponse>('/api/v1/auth/2fa/disable', {
      method: 'POST',
      body: JSON.stringify({ password, code }),
    });
  }

  async regenerateBackupCodes(): Promise<TwoFactorBackupCodes> {
    return this.request<TwoFactorBackupCodes>('/api/v1/auth/2fa/backup-codes', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  async get2FAQRCode(): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/api/v1/auth/2fa/qr`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getCurrentToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get QR code: ${response.statusText}`);
    }

    return response.blob();
  }

  // Notification Settings
  async getNotificationSettings(): Promise<NotificationSettings> {
    return this.request<NotificationSettings>('/api/v1/settings/notifications');
  }

  async updateNotificationSettings(settings: NotificationSettings): Promise<NotificationSettings> {
    return this.request<NotificationSettings>('/api/v1/settings/notifications', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Storage Settings
  async getStorageData(): Promise<StorageData> {
    return this.request<StorageData>('/api/v1/settings/storage');
  }

  async updateRetentionPeriod(months: number): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/v1/settings/storage/retention', {
      method: 'PUT',
      body: JSON.stringify({ months }),
    });
  }

  async exportData(): Promise<{ filename: string; downloadUrl: string; message: string }> {
    return this.request<{ filename: string; downloadUrl: string; message: string }>('/api/v1/settings/data/export', {
      method: 'POST',
    });
  }

  async deleteAllData(confirmation: string): Promise<{ 
    message: string; 
    deleted_records: {
      campaigns: number;
      contacts: number;
      email_trackers: number;
      templates: number;
    };
    deletion_time: string;
  }> {
    return this.request('/api/v1/settings/data/delete', {
      method: 'DELETE',
      body: JSON.stringify({ confirmation }),
    });
  }

  // Domain Settings
  async getDomainSettings(): Promise<DomainSettings> {
    return this.request<DomainSettings>('/api/v1/settings/domains');
  }

  async updateDomainSettings(settings: DomainSettings): Promise<DomainSettings> {
    return this.request<DomainSettings>('/api/v1/settings/domains', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async getDomainStatus(): Promise<DomainStatus> {
    return this.request<DomainStatus>('/api/v1/settings/domains/status');
  }

  async verifyDnsRecords(): Promise<DomainStatus> {
    return this.request<DomainStatus>('/api/v1/settings/domains/verify', {
      method: 'POST',
    });
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const emailTrackerAPI = new EmailTrackerAPI();
export default emailTrackerAPI;
