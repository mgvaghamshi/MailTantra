import type { Contact, Template } from "@/lib/emailtracker-api";

export interface CampaignFormData {
  // Step 1: Campaign Details
  name: string;
  type: CampaignType;
  subject: string;
  description?: string;
  tags?: string[];

  // Step 2: Email Design
  templateId?: string;
  selectedTemplate?: Template;
  customContent?: string;
  preheaderText?: string;

  // Step 3: Audience Selection
  recipients: Contact[];
  segmentIds?: string[];
  excludeUnsubscribed?: boolean;
  excludeBounced?: boolean;

  // Step 4: Schedule & Delivery
  scheduleType: ScheduleType;
  scheduledAt?: Date;
  timezone?: string;
  sendRate?: number;
  abTest?: ABTestConfig;

  // Step 5: Review & Launch
  testEmails?: string[];
  isReviewed?: boolean;
  complianceChecked?: boolean;
}

export type CampaignType = 
  | "newsletter"
  | "promotional" 
  | "transactional"
  | "announcement"
  | "welcome"
  | "reengagement";

export type ScheduleType = 
  | "immediate"
  | "scheduled"
  | "recurring";

export interface ABTestConfig {
  enabled: boolean;
  testType: "subject" | "content" | "sendTime";
  variations: ABTestVariation[];
  splitPercentage: number;
  duration?: number;
}

export interface ABTestVariation {
  id: string;
  name: string;
  content: string;
  percentage: number;
}

export interface CampaignStep {
  number: number;
  title: string;
  description: string;
  completed: boolean;
  valid: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface CampaignWizardProps {
  currentStep: number;
  campaignData: Partial<CampaignFormData>;
  onStepChange: (step: number) => void;
  onDataChange: (data: Partial<CampaignFormData>) => void;
  onSuccess?: (campaignId: string) => void;
}

export interface CampaignProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  onStepClick?: (step: number) => void;
}
