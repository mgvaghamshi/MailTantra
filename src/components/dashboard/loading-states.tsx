"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <Card className={cn("animate-pulse", className)}>
      <CardHeader className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </CardContent>
    </Card>
  );
}

export function LoadingMetricCard() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
      </CardHeader>
      <CardContent>
        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </CardContent>
    </Card>
  );
}

export function LoadingCampaignCard() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-10"></div>
          </div>
          <div>
            <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-10"></div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LoadingContactCard() {
  return (
    <div className="animate-pulse flex items-center justify-between p-3">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-16"></div>
    </div>
  );
}

export function LoadingTableRow() {
  return (
    <div className="animate-pulse flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-16"></div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="flex space-x-3">
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>

      {/* Quick Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <LoadingMetricCard key={i} />
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-64"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-24"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <LoadingCampaignCard key={i} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
