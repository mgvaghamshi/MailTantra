/**
 * Usage API endpoint for fetching current rate limit and usage data
 * This proxies requests to the backend API with proper authentication
 */
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_EMAILTRACKER_API_URL || 'http://localhost:8001';

export interface UsageData {
  limit: number;
  remaining: number;
  resetTime: number;
  used: number;
  percentage: number;
}

export async function GET(request: NextRequest) {
  try {
    // Get the JWT token from the Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization token' },
        { status: 401 }
      );
    }

    // Use 127.0.0.1 instead of localhost to avoid IPv6 issues
    const apiUrl = API_BASE_URL.replace('localhost', '127.0.0.1');

    // Call the backend API keys usage summary endpoint with JWT authentication
    const response = await fetch(`${apiUrl}/api/v1/auth/api-keys/usage/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader // Forward the JWT token
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      throw new Error(`Backend API returned ${response.status}`);
    }

    // Parse the JSON response from the backend
    const backendData = await response.json();
    
    // Transform backend response to our UsageData format
    // Backend returns: { total_requests_this_month, total_available_requests, usage_percentage, most_used_endpoints }
    const usageData: UsageData = {
      limit: backendData.total_available_requests || 10000,
      remaining: Math.max(0, (backendData.total_available_requests || 10000) - (backendData.total_requests_this_month || 0)),
      resetTime: Math.floor(Date.now() / 1000) + 86400, // Reset in 24 hours (simplified)
      used: backendData.total_requests_this_month || 0,
      percentage: backendData.usage_percentage || 0
    };

    return NextResponse.json(usageData);

  } catch (error) {
    console.error('Error fetching usage data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}
