'use client';

import { Card } from '@/components/ui/card';

// Campaign Card Skeleton
export function CampaignCardSkeleton() {
  return (
    <Card className="p-6 animate-pulse">
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-2">
              <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-12 mx-auto"></div>
            </div>
            <div className="text-center space-y-2">
              <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-12 mx-auto"></div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                <div className="h-5 bg-gray-200 rounded w-10 mx-auto"></div>
              </div>
              <div className="text-center space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                <div className="h-5 bg-gray-200 rounded w-10 mx-auto"></div>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-200 text-center space-y-2">
            <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
          </div>
        </div>

        {/* Action Section */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="h-9 bg-gray-200 rounded flex-1"></div>
            <div className="h-9 bg-gray-200 rounded flex-1"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
  return (
    <Card className="p-6 animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </Card>
  );
}

// Campaigns Page Loading State
export function CampaignsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-36 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Stats Overview Skeleton */}
        <div className="space-y-6">
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Filters Skeleton */}
        <Card className="p-6 animate-pulse">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row flex-1 gap-3 w-full max-w-2xl">
              <div className="h-12 bg-gray-200 rounded flex-1"></div>
              <div className="h-12 w-40 bg-gray-200 rounded"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-12 w-32 bg-gray-200 rounded"></div>
              <div className="h-12 w-28 bg-gray-200 rounded"></div>
            </div>
          </div>
        </Card>

        {/* Campaigns Grid Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CampaignCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
