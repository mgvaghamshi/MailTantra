import { CampaignFormData } from '@/types/campaign';

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'completed' | 'failed' | 'recurring';

// Backend campaign type (matches API response)
export interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
  scheduled_at?: string;
  sent_at?: string;
  total_recipients?: number;
  sent_count?: number;
  open_count?: number;
  click_count?: number;
  bounce_count?: number;
  unsubscribe_count?: number;
  template_id?: string;
  html_content?: string;
  recipients?: any[];
  recurring_config?: any;
}

export function getCampaignStatusColor(status: CampaignStatus): string {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'sending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'sent':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'paused':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'completed':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'recurring':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function formatCampaignStatus(status: CampaignStatus): string {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'scheduled':
      return 'Scheduled';
    case 'sending':
      return 'Sending';
    case 'sent':
      return 'Sent';
    case 'paused':
      return 'Paused';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    case 'recurring':
      return 'Recurring';
    default:
      return 'Unknown';
  }
}

export function isCampaignEditable(status: CampaignStatus): boolean {
  return status === 'draft' || status === 'paused';
}

export function isCampaignDeletable(status: CampaignStatus): boolean {
  return status === 'draft' || status === 'failed' || status === 'completed';
}

export function canResendCampaign(status: CampaignStatus): boolean {
  return status === 'sent' || status === 'completed' || status === 'failed';
}

export function getCampaignProgress(campaign: Campaign): number {
  if (!campaign.total_recipients || campaign.total_recipients === 0) {
    return 0;
  }
  
  const sent = campaign.sent_count || 0;
  return Math.round((sent / campaign.total_recipients) * 100);
}

export function formatCampaignDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function validateCampaignData(campaign: Partial<Campaign>): string[] {
  const errors: string[] = [];

  if (!campaign.name?.trim()) {
    errors.push('Campaign name is required');
  }

  if (!campaign.subject?.trim()) {
    errors.push('Email subject is required');
  }

  if (!campaign.template_id && !campaign.html_content?.trim()) {
    errors.push('Either a template or custom HTML content is required');
  }

  if (!campaign.recipients || campaign.recipients.length === 0) {
    errors.push('At least one recipient is required');
  }

  return errors;
}

export function getCampaignTypeLabel(campaign: Campaign): string {
  if (campaign.recurring_config) {
    return 'Recurring';
  }
  if (campaign.scheduled_at && new Date(campaign.scheduled_at) > new Date()) {
    return 'Scheduled';
  }
  return 'One-time';
}
