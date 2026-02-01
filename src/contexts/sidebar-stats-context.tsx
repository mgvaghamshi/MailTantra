"use client"

import React, { createContext, useContext, ReactNode } from 'react';
import { useSidebarStats } from '@/hooks/use-sidebar-stats';

interface SidebarStats {
  contactsCount: number;
  campaignsCount: number;
  apiUsage: {
    used: number;
    total: number;
    percentage: number;
  };
}

interface SidebarStatsContextType {
  stats: SidebarStats;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const SidebarStatsContext = createContext<SidebarStatsContextType | undefined>(undefined);

export function SidebarStatsProvider({ children }: { children: ReactNode }) {
  const { stats, loading, error, refresh } = useSidebarStats();

  return (
    <SidebarStatsContext.Provider value={{ stats, loading, error, refresh }}>
      {children}
    </SidebarStatsContext.Provider>
  );
}

export function useSidebarStatsContext() {
  const context = useContext(SidebarStatsContext);
  if (!context) {
    throw new Error('useSidebarStatsContext must be used within SidebarStatsProvider');
  }
  return context;
}
