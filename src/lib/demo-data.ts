// Demo data for EmailTracker Dashboard
// This provides realistic sample data when the API is not available or returns empty results

export const demoAnalytics = {
  current_month: {
    total_campaigns: 12,
    total_emails_sent: 45789,
    total_delivered: 44123,
    total_opened: 12456,
    total_clicked: 3421,
    overall_open_rate: 28.2,
    overall_click_rate: 7.7
  },
  previous_month: {
    total_campaigns: 10,
    total_emails_sent: 38542,
    total_delivered: 37123,
    total_opened: 9876,
    total_clicked: 2654,
    overall_open_rate: 26.6,
    overall_click_rate: 7.1
  },
  month_over_month: {
    campaigns_change: 20.0,
    emails_change: 18.8,
    delivered_change: 18.9,
    open_rate_change: 6.0,
    click_rate_change: 8.5
  },
  recent_campaigns: [
    {
      id: "1",
      name: "Welcome Series - January 2025",
      status: "sent",
      created_at: "2025-01-15T10:00:00Z",
      emails_sent: 1250,
      open_rate: 32.4,
      click_rate: 8.9
    },
    {
      id: "2", 
      name: "Product Launch Announcement",
      status: "sent",
      created_at: "2025-01-20T14:30:00Z",
      emails_sent: 8900,
      open_rate: 28.7,
      click_rate: 12.3
    },
    {
      id: "3",
      name: "Newsletter - February Edition",
      status: "active",
      created_at: "2025-02-01T09:15:00Z",
      emails_sent: 5430,
      open_rate: 24.1,
      click_rate: 5.6
    }
  ]
};

export const demoSidebarStats = {
  contactsCount: 15847,
  campaignsCount: 12,
  apiUsage: {
    used: 7832,
    total: 10000,
    percentage: 78.32
  }
};

export const demoCampaigns = [
  {
    id: "1",
    name: "Welcome Series - January 2025",
    subject: "Welcome to Our Platform!",
    description: "Onboarding series for new users",
    status: "sent" as const,
    recipients_count: 1250,
    sent_count: 1245,
    open_rate: 32.4,
    click_rate: 8.9,
    created_at: "2025-01-15T10:00:00Z",
    sent_at: "2025-01-15T15:30:00Z"
  },
  {
    id: "2",
    name: "Product Launch Announcement",
    subject: "🚀 Exciting New Features Just Launched!",
    description: "Announcing our latest product features and improvements",
    status: "sent" as const,
    recipients_count: 8900,
    sent_count: 8834,
    open_rate: 28.7,
    click_rate: 12.3,
    created_at: "2025-01-20T14:30:00Z",
    sent_at: "2025-01-20T16:00:00Z"
  },
  {
    id: "3",
    name: "Newsletter - February Edition",
    subject: "February Updates: What's New This Month",
    description: "Monthly newsletter with product updates and industry insights",
    status: "sent" as const,
    recipients_count: 5430,
    sent_count: 5401,
    open_rate: 24.1,
    click_rate: 5.6,
    created_at: "2025-02-01T09:15:00Z",
    sent_at: "2025-02-01T11:00:00Z"
  },
  {
    id: "4",
    name: "Spring Sale Campaign",
    subject: "Spring Sale - 25% Off Everything!",
    description: "Seasonal promotional campaign offering significant discounts",
    status: "scheduled" as const,
    recipients_count: 12000,
    sent_count: 0,
    open_rate: 0,
    click_rate: 0,
    created_at: "2025-02-10T13:20:00Z",
    sent_at: undefined
  },
  {
    id: "5",
    name: "Customer Feedback Survey",
    subject: "Help Us Improve - Quick 2-Minute Survey",
    description: "Monthly customer satisfaction and feedback collection",
    status: "draft" as const,
    recipients_count: 0,
    sent_count: 0,
    open_rate: 0,
    click_rate: 0,
    created_at: "2025-02-12T16:45:00Z",
    sent_at: undefined
  },
  {
    id: "6",
    name: "Holiday Special Offers",
    subject: "Limited Time: Holiday Deals Inside!",
    description: "Special holiday promotions and exclusive offers",
    status: "sent" as const,
    recipients_count: 18500,
    sent_count: 18234,
    open_rate: 35.8,
    click_rate: 14.2,
    created_at: "2024-12-20T08:00:00Z",
    sent_at: "2024-12-20T10:00:00Z"
  }
];

export const demoContacts = [
  {
    id: "1",
    email: "john.doe@example.com",
    first_name: "John",
    last_name: "Doe",
    status: "active",
    tags: ["customer", "premium"],
    custom_fields: { company: "Acme Corp", role: "Manager" },
    created_at: "2025-01-10T09:30:00Z",
    updated_at: "2025-01-15T14:20:00Z",
    last_activity: "2025-01-28T11:45:00Z"
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    first_name: "Jane",
    last_name: "Smith",
    status: "active",
    tags: ["lead", "newsletter"],
    custom_fields: { source: "website", interest: "product_updates" },
    created_at: "2025-01-12T11:15:00Z",
    updated_at: "2025-01-20T16:30:00Z",
    last_activity: "2025-01-29T09:20:00Z"
  },
  {
    id: "3",
    email: "mike.johnson@example.com",
    first_name: "Mike",
    last_name: "Johnson",
    status: "unsubscribed",
    tags: ["former_customer"],
    custom_fields: { unsubscribe_reason: "too_frequent" },
    created_at: "2024-12-05T13:45:00Z",
    updated_at: "2025-01-08T10:15:00Z",
    last_activity: "2025-01-08T10:15:00Z"
  }
];

export const demoTemplates = [
  {
    id: "1",
    name: "Welcome Email Template",
    type: "welcome",
    status: "published",
    subject: "Welcome to Our Platform!",
    description: "Standard welcome email for new users",
    usage_count: 1250,
    created_at: "2024-11-15T10:00:00Z",
    updated_at: "2025-01-10T14:30:00Z"
  },
  {
    id: "2",
    name: "Monthly Newsletter",
    type: "newsletter",
    status: "published", 
    subject: "Your Monthly Update",
    description: "Template for monthly newsletter campaigns",
    usage_count: 8,
    created_at: "2024-10-20T09:15:00Z",
    updated_at: "2025-02-01T11:45:00Z"
  },
  {
    id: "3",
    name: "Product Launch",
    type: "promotional",
    status: "draft",
    subject: "Exciting New Product Launch!",
    description: "Template for product launch announcements",
    usage_count: 0,
    created_at: "2025-02-10T15:20:00Z",
    updated_at: "2025-02-10T15:20:00Z"
  }
];

export const demoApiKeys = [
  {
    id: "1",
    name: "Production API Key",
    is_active: true,
    created_at: "2024-11-01T10:00:00Z",
    last_used_at: "2025-01-29T14:30:00Z",
    expires_at: null,
    requests_per_minute: 100,
    requests_per_day: 10000
  },
  {
    id: "2",
    name: "Development Key",
    is_active: true,
    created_at: "2024-12-15T09:30:00Z",
    last_used_at: "2025-01-28T16:45:00Z",
    expires_at: null,
    requests_per_minute: 50,
    requests_per_day: 5000
  },
  {
    id: "3",
    name: "Testing Key",
    is_active: false,
    created_at: "2025-01-05T11:20:00Z", 
    last_used_at: "2025-01-20T13:15:00Z",
    expires_at: "2025-03-01T00:00:00Z",
    requests_per_minute: 10,
    requests_per_day: 1000
  }
];

// Check if we should use demo data (when API returns empty results or is unavailable)
export const shouldUseDemoData = (apiData: unknown): boolean => {
  // Use demo data if API data is null, undefined, or contains no meaningful data
  if (!apiData) return true;
  
  // For analytics, check if total campaigns is 0
  if (typeof apiData === 'object' && apiData !== null && 'total_campaigns' in apiData) {
    const data = apiData as { total_campaigns: number };
    if (typeof data.total_campaigns === 'number' && data.total_campaigns === 0) {
      return true;
    }
  }
  
  // For arrays, check if empty
  if (Array.isArray(apiData) && apiData.length === 0) {
    return true;
  }
  
  // For objects with data arrays, check if the data array is empty
  if (typeof apiData === 'object' && apiData !== null && 'data' in apiData) {
    const data = apiData as { data: unknown };
    if (Array.isArray(data.data) && data.data.length === 0) {
      return true;
    }
  }
  
  return false;
};
