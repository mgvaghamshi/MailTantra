'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRateLimit } from '@/contexts/rate-limit-context';
import { useAuth } from '@/contexts/auth-context';
import { emailTrackerAPI } from '@/lib/emailtracker-api';
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { RateLimitBanner } from "@/components/rate-limit-banner";
import { ProtectedRoute } from "@/components/auth/protected-route";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { updateFromResponse } = useRateLimit();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    // Set up global rate limit tracking for all API requests
    emailTrackerAPI.setRateLimitCallback((response) => {
      updateFromResponse(response);
    });
  }, [updateFromResponse]);

  // Check if current path should not have the dashboard layout
  const isAuthRoute = pathname?.startsWith('/auth');
  const isLandingPage = pathname === '/landing';
  const isRootPage = pathname === '/';
  
  // For auth routes, landing page, and root page, render without dashboard layout
  if (isAuthRoute || isLandingPage || isRootPage) {
    return <>{children}</>;
  }

  // For protected routes, wrap with authentication
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            {/* Standardized page container with consistent padding */}
            <div className="min-h-full">
              <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <RateLimitBanner />
                <div className="space-y-8">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
