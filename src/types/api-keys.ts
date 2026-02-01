export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  is_active: boolean;
  created_at: string;
  expires_at?: string;
  last_used_at?: string;
  requests_per_minute: number;
  requests_per_day: number;
  description?: string;
  created_by?: string;
}

export interface ApiKeyCreateRequest {
  name: string;
  scopes?: string[];
  requests_per_minute?: number;
  requests_per_day?: number;
  expires_in_days?: number;
  description?: string;
}

export interface ApiKeyCreateResponse {
  api_key: ApiKey;
  key: string; // The actual secret key - only returned once
  message: string;
}

export interface ApiKeyUpdateRequest {
  name?: string;
  scopes?: string[];
  is_active?: boolean;
  requests_per_minute?: number;
  requests_per_day?: number;
  expires_in_days?: number;
  description?: string;
}

export interface ApiKeyListResponse {
  keys: ApiKey[];
  total: number;
}

export interface ApiKeyUsageRecord {
  id: string;
  api_key_id: string;
  endpoint: string;
  method: string;
  timestamp: string;
  status_code: number;
  response_time_ms: number;
  ip_address?: string;
  user_agent?: string;
  request_size_bytes?: number;
  response_size_bytes?: number;
}

export interface ApiKeyUsageResponse {
  usage: ApiKeyUsageRecord[];
  total: number;
  page: number;
  per_page: number;
}

export interface ApiKeyStatsResponse {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  success_rate: number;
  avg_response_time: number;
  requests_by_day: Array<{
    date: string;
    requests: number;
    successful: number;
    failed: number;
  }>;
  most_used_endpoints: Array<{
    endpoint: string;
    requests: number;
  }>;
  status_code_breakdown: Array<{
    status_code: number;
    count: number;
    percentage: number;
  }>;
}

export interface ApiKeyScope {
  id: string;
  name: string;
  description: string;
  endpoints: string[];
}

export interface ApiKeyScopePreset {
  id: string;
  name: string;
  description: string;
  scopes: string[];
}

export interface AvailableScopesResponse {
  scopes: { [key: string]: ApiKeyScope };
  presets: { [key: string]: ApiKeyScopePreset };
}

export interface AggregateApiUsageResponse {
  total_requests_this_month: number;
  total_monthly_limit: number;
  usage_percentage: number;
  api_keys_count: number;
  most_used_endpoints: Array<{
    endpoint: string;
    requests: number;
  }>;
}
