/**
 * Usage API endpoint for fetching current rate limit and usage data
 */
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_EMAILTRACKER_API_URL || 'http://localhost:8001';
const API_KEY = process.env.NEXT_PUBLIC_EMAILTRACKER_API_KEY;

export interface UsageData {
  limit: number;
  remaining: number;
  resetTime: number;
  used: number;
  percentage: number;
}

export async function GET(request: NextRequest) {
  try {
    // Use 127.0.0.1 instead of localhost to avoid IPv6 issues
    const apiUrl = API_BASE_URL.replace('localhost', '127.0.0.1');

    // Call our new usage endpoint that doesn't require API key authentication
    const response = await fetch(`${apiUrl}/api/usage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Backend API returned ${response.status}`);
    }

    // Parse the JSON response from our backend /api/usage endpoint
    const usageData: UsageData = await response.json();

    return NextResponse.json(usageData);

  } catch (error) {
    console.error('Error fetching usage data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}
