'use client'

import { useSessionManagement } from '@/hooks/use-session-management'

export function SessionManager() {
  useSessionManagement()
  return null
}
