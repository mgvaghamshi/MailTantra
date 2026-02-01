"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  Key, 
  Smartphone, 
  Eye, 
  EyeOff, 
  Clock, 
  Monitor, 
  AlertTriangle,
  CheckCircle,
  Download,
  X,
  RefreshCw,
  Activity,
  MapPin,
  Calendar,
  Globe,
  Loader2,
  Lock,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'
import { emailTrackerAPI, SecuritySettings } from '@/lib/emailtracker-api'
import { SessionTime, AuditTime, RelativeTime } from '@/components/ui/time-display'
import { formatRelativeTime } from '@/lib/time-utils'
import { apiClient } from '@/lib/api-client'

interface Session {
  id: string
  device_name: string
  ip_address: string
  user_agent: string
  location?: string
  created_at: string
  last_activity: string
  expires_at: string
  is_current: boolean
  revoking?: boolean  // For optimistic UI updates
}

interface AuditLog {
  id: string
  action: string
  resource_type?: string
  resource_id?: string
  description: string
  ip_address?: string
  user_agent?: string
  success: boolean
  failure_reason?: string
  security_metadata?: Record<string, any>  // Updated field name
  timestamp: string
}

interface SecurityStats {
  total_login_attempts: number
  successful_logins: number
  failed_logins: number
  unique_ip_addresses: number
  security_events: number
  two_factor_enabled: boolean
  two_factor_last_used?: string
  period_days: number
}

export default function EnhancedSecuritySettings() {
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  
  // State for different sections
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [securityStats, setSecurityStats] = useState<SecurityStats | null>(null)
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [passwordStrength, setPasswordStrength] = useState<any>(null)
  
  // Dialog states
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showSessionRevokeDialog, setShowSessionRevokeDialog] = useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadSecuritySettings(),
        loadSessions(),
        loadAuditLogs(),
        loadSecurityStats()
      ])
    } catch (error) {
      console.error('Failed to load security data:', error)
      toast.error('Failed to load security information')
    } finally {
      setLoading(false)
    }
  }

  const loadSecuritySettings = async () => {
    try {
      const data = await emailTrackerAPI.getSecuritySettings()
      setSecuritySettings(data)
    } catch (error) {
      console.error('Failed to load security settings:', error)
    }
  }

  const loadSessions = async () => {
    try {
      const data = await emailTrackerAPI.getActiveSessions()
      setSessions(data)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    }
  }

  // Auto-refresh sessions every 30 seconds
  useEffect(() => {
    const interval = setInterval(loadSessions, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadAuditLogs = async () => {
    try {
      const data = await emailTrackerAPI.getSecurityAuditLog()
      setAuditLogs(data)
    } catch (error) {
      console.error('Failed to load audit logs:', error)
    }
  }

  const loadSecurityStats = async () => {
    try {
      const data = await emailTrackerAPI.getSecurityStats()
      setSecurityStats(data)
    } catch (error) {
      console.error('Failed to load security stats:', error)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Passwords do not match')
      return
    }
    
    setUpdating(true)
    try {
      await emailTrackerAPI.changePassword(passwordData)
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' })
      setShowPasswordDialog(false)
      toast.success('Password changed successfully! Please log in again with your new password.')
      await loadSecuritySettings()
      
      // Force logout after password change for security
      setTimeout(() => {
        // Clear any stored tokens
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        sessionStorage.clear()
        
        // Redirect to login page
        window.location.href = '/auth/login'
      }, 2000)
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password')
    } finally {
      setUpdating(false)
    }
  }

  const checkPasswordStrength = async (password: string) => {
    if (password.length === 0) {
      setPasswordStrength(null)
      return
    }
    
    try {
      const result = await emailTrackerAPI.checkPasswordStrength(password)
      setPasswordStrength(result)
    } catch (error) {
      console.error('Failed to check password strength:', error)
    }
  }

  const updateSecuritySettings = async (updates: Partial<SecuritySettings>) => {
    setUpdating(true)
    try {
      await emailTrackerAPI.updateSecuritySettings(updates)
      await loadSecuritySettings()
      toast.success('Security settings updated')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update settings')
    } finally {
      setUpdating(false)
    }
  }

  const revokeSession = async (sessionId: string) => {
    // Ensure user is authenticated
    if (!apiClient.isAuthenticated()) {
      toast.error('Please log in again to continue')
      return
    }

    // Optimistic update - mark session as revoking
    setSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, is_active: false, revoking: true }
          : session
      )
    )

    try {
      await emailTrackerAPI.revokeSession(sessionId)
      // Remove the session from the list after successful revocation
      setSessions(prev => prev.filter(session => session.id !== sessionId))
      setShowSessionRevokeDialog(false)
      setSelectedSession(null)
      toast.success('Session revoked successfully')
    } catch (error: any) {
      console.error('Revoke session error:', error)
      
      // Handle authentication errors
      if (error.message?.includes('403') || error.message?.includes('Not authenticated') ||
          error.message?.includes('401') || error.message?.includes('Invalid or expired JWT token')) {
        try {
          await apiClient.refreshTokens()
          await emailTrackerAPI.revokeSession(sessionId)
          setSessions(prev => prev.filter(session => session.id !== sessionId))
          setShowSessionRevokeDialog(false)
          setSelectedSession(null)
          toast.success('Session revoked successfully')
          return
        } catch (refreshError: any) {
          toast.error('Your session has expired. Please log in again.')
          window.location.href = '/auth/login'
          return
        }
      }

      // Handle 404 Session not found specifically
      if (error.message?.includes('404') && error.message?.includes('Session not found')) {
        toast.error('Your current session is no longer valid. Please log in again.')
        apiClient.logout()
        window.location.href = '/auth/login'
        return
      }
      
      // Revert optimistic update on error
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, is_active: true, revoking: false }
            : session
        )
      )
      toast.error(error.message || 'Failed to revoke session')
    }
  }

  const revokeAllSessions = async () => {
    try {
      // Ensure user is authenticated
      if (!apiClient.isAuthenticated()) {
        toast.error('Please log in again to continue')
        return
      }

      const result = await emailTrackerAPI.revokeAllSessions()
      await loadSessions()
      toast.success(`All sessions revoked successfully. ${result.revoked_count} sessions were terminated.`)
    } catch (error: any) {
      console.error('Revoke all sessions error:', error)
      
      // Handle specific error cases
      if (error.message?.includes('403') || error.message?.includes('Not authenticated') || 
          error.message?.includes('401') || error.message?.includes('Invalid or expired JWT token')) {
        // Try to refresh token and retry
        try {
          await apiClient.refreshTokens()
          const result = await emailTrackerAPI.revokeAllSessions()
          await loadSessions()
          toast.success(`All sessions revoked successfully. ${result.revoked_count} sessions were terminated.`)
          return
        } catch (refreshError: any) {
          toast.error('Your session has expired. Please log in again.')
          // Optionally redirect to login
          window.location.href = '/auth/login'
          return
        }
      }
      
      if (error.message?.includes('404')) {
        if (error.message?.includes('Session not found')) {
          toast.error('Your current session is no longer valid. Redirecting to login...')
          // Clear tokens and redirect to login after a short delay
          setTimeout(() => {
            apiClient.logout()
            window.location.href = '/auth/login'
          }, 2000)
        } else {
          toast.error('Session management feature is not available. Please contact support.')
        }
      } else if (error.message?.includes('429')) {
        toast.error('Too many requests. Please wait a moment and try again.')
      } else {
        toast.error(error.message || 'Failed to revoke sessions. Please try again.')
      }
    }
  }

  const formatDate = (dateString: string) => {
    return formatRelativeTime(dateString)
  }

  // Helper function to safely check if a value exists and is greater than a threshold
  const hasValueGreaterThan = (value: number | null | undefined, threshold: number): boolean => {
    return value !== null && value !== undefined && value > threshold
  }

  // Helper function to safely check if a value exists and is truthy
  const hasValue = (value: any): boolean => {
    return value !== null && value !== undefined && value !== 0 && Boolean(value)
  }

  const getSecurityScore = () => {
    if (!securitySettings) return 0
    let score = 0
    const maxScore = 100
    
    // Two-factor authentication (30 points)
    if (securitySettings.two_factor_enabled && securitySettings.two_factor_verified) {
      score += 30
    } else if (securitySettings.two_factor_enabled) {
      score += 15 // Enabled but not verified
    }
    
    // Password age (20 points)
    if (securitySettings.password_changed_at) {
      const passwordAge = securitySettings.password_age_days || 
        Math.floor((new Date().getTime() - new Date(securitySettings.password_changed_at).getTime()) / (1000 * 60 * 60 * 24))
      if (passwordAge <= 30) score += 20
      else if (passwordAge <= 90) score += 15
      else if (passwordAge <= 180) score += 10
      else score += 5
    }
    
    // Session management (15 points)
    if (securitySettings.session_timeout_hours <= 4) score += 10
    if (securitySettings.max_concurrent_sessions <= 3) score += 5
    
    // Security notifications (15 points)
    if (securitySettings.login_notifications) score += 8
    if (securitySettings.suspicious_activity_alerts) score += 7
    
    // API key rotation (10 points)
    if (securitySettings.api_key_rotation_enabled) score += 10
    
    // Active session count (10 points)
    const sessionCount = sessions.length
    if (sessionCount <= 2) score += 10
    else if (sessionCount <= 5) score += 5
    
    return Math.min(score, maxScore)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const securityScore = getSecurityScore()

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Security Center</h1>
            <p className="text-gray-600">Manage your account security and monitor activity</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Security Score</p>
            <div className="flex items-center space-x-2">
              <Progress value={securityScore} className="w-24 h-2" />
              <span className="text-lg font-bold">{securityScore}%</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="two-factor">Two-Factor</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="audit">Activity</TabsTrigger>
        </TabsList>

        {/* Security Overview */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Shield className={`h-5 w-5 ${securitySettings?.two_factor_enabled ? 'text-green-600' : 'text-orange-600'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">2FA Status</p>
                    <p className={`text-lg font-bold ${securitySettings?.two_factor_enabled ? 'text-green-600' : 'text-orange-600'}`}>
                      {securitySettings?.two_factor_enabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                    <p className="text-lg font-bold text-blue-600">{sessions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Recent Logins</p>
                    <p className="text-lg font-bold text-purple-600">{securityStats?.successful_logins || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Password Age</p>
                    <p className="text-lg font-bold text-gray-600">
                      {securitySettings?.password_age_days !== null && securitySettings?.password_age_days !== undefined 
                        ? `${securitySettings.password_age_days} day${securitySettings.password_age_days !== 1 ? 's' : ''}`
                        : securitySettings?.password_changed_at 
                          ? `${Math.floor((new Date().getTime() - new Date(securitySettings.password_changed_at).getTime()) / (1000 * 60 * 60 * 24))} days`
                          : 'Unknown'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Security Recommendations</CardTitle>
              <CardDescription>Improve your account security with these suggestions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securitySettings && !securitySettings.two_factor_enabled && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>Enable two-factor authentication for enhanced security</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab('two-factor')}
                      >
                        Enable 2FA
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {securitySettings && hasValueGreaterThan(securitySettings.password_age_days, 90) && (
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>Your password is over 90 days old. Consider changing it.</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab('password')}
                      >
                        Change Password
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {securitySettings && hasValueGreaterThan(securitySettings.active_sessions_count, 5) && (
                <Alert>
                  <Monitor className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>You have many active sessions. Review and revoke unused ones.</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab('sessions')}
                      >
                        Manage Sessions
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Recent Security Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Activity</CardTitle>
              <CardDescription>Latest security events on your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${log.success ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium">{log.action.replace('_', ' ').toUpperCase()}</p>
                        <p className="text-sm text-gray-600">{log.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <RelativeTime timestamp={log.timestamp} className="text-sm text-gray-500" />
                      <p className="text-xs text-gray-400">{log.ip_address}</p>
                    </div>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password Management */}
        <TabsContent value="password">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Password Security</CardTitle>
                <CardDescription>Manage your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Password Last Changed</Label>
                  <p className="text-sm text-gray-600">
                    {securitySettings?.password_changed_at 
                      ? formatDate(securitySettings.password_changed_at)
                      : 'Never changed'
                    }
                  </p>
                  {securitySettings && securitySettings.password_changed_at && (
                    <RelativeTime 
                      timestamp={securitySettings.password_changed_at} 
                      className="text-xs text-gray-500" 
                    />
                  )}
                </div>

                <Separator />

                <Button onClick={() => setShowPasswordDialog(true)} className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
                <CardDescription>Password requirements and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Require Regular Changes</p>
                      <p className="text-sm text-gray-600">Force password change every 90 days</p>
                    </div>
                    <Switch
                      checked={securitySettings?.require_password_change || false}
                      onCheckedChange={(checked) => 
                        updateSecuritySettings({ require_password_change: checked })
                      }
                      disabled={updating}
                    />
                  </div>

                  {securitySettings && securitySettings.require_password_change && (
                    <div className="space-y-2">
                      <Label>Change Password Every (days)</Label>
                      <Select
                        value={securitySettings.password_change_days?.toString() || '90'}
                        onValueChange={(value) => 
                          updateSecuritySettings({ password_change_days: parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Two-Factor Authentication */}
        <TabsContent value="two-factor">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Two-Factor Authentication</span>
                {securitySettings && securitySettings.two_factor_enabled && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Enabled
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Secure your account with an additional verification step
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* TwoFactorManager component would go here */}
              <div className="text-center py-8">
                <Smartphone className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Two-factor authentication management</p>
                <p className="text-sm text-gray-500 mt-2">
                  Status: {securitySettings?.two_factor_enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Session Management */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5" />
                  <span>Active Sessions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={loadSessions}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="destructive" size="sm" onClick={revokeAllSessions}>
                    Revoke All
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Manage devices and locations where you're signed in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{session.device_name}</p>
                          {session.is_current && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center space-x-1">
                            <Globe className="h-3 w-3" />
                            <span>{session.ip_address}</span>
                            {session.location && (
                              <>
                                <span>•</span>
                                <MapPin className="h-3 w-3" />
                                <span>{session.location}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Last active: </span>
                            <SessionTime timestamp={session.last_activity} />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {!session.is_current && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={session.revoking}
                        onClick={() => {
                          setSelectedSession(session)
                          setShowSessionRevokeDialog(true)
                        }}
                      >
                        {session.revoking ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Revoking...
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 mr-1" />
                            Revoke
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                ))}
                
                {sessions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Monitor className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No active sessions found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Audit Log */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Security Activity Log</CardTitle>
              <CardDescription>Complete history of security events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-1 ${log.success ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium">{log.action.replace(/_/g, ' ').toUpperCase()}</p>
                        <p className="text-sm text-gray-600">{log.description}</p>
                        {log.failure_reason && (
                          <p className="text-sm text-red-600">Reason: {log.failure_reason}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          {log.ip_address && (
                            <span className="flex items-center space-x-1">
                              <Globe className="h-3 w-3" />
                              <span>{log.ip_address}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant={log.success ? 'default' : 'destructive'}>
                        {log.success ? 'Success' : 'Failed'}
                      </Badge>
                      <AuditTime timestamp={log.timestamp} className="text-right" />
                    </div>
                  </div>
                ))}
                
                {auditLogs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No security activity found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new secure password
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.new_password}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, new_password: e.target.value })
                    checkPasswordStrength(e.target.value)
                  }}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              
              {passwordStrength && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Password Strength</span>
                    <span className={`text-sm font-medium ${
                      passwordStrength.strength === 'Strong' ? 'text-green-600' :
                      passwordStrength.strength === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {passwordStrength.strength}
                    </span>
                  </div>
                  <Progress 
                    value={(passwordStrength.score / passwordStrength.max_score) * 100} 
                    className="h-2"
                  />
                  {passwordStrength.issues.length > 0 && (
                    <ul className="text-xs text-gray-600 space-y-1">
                      {passwordStrength.issues.map((issue: string, index: number) => (
                        <li key={index}>• {issue}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updating || passwordData.new_password !== passwordData.confirm_password}
              >
                {updating && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                Change Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Session Revoke Dialog */}
      <Dialog open={showSessionRevokeDialog} onOpenChange={setShowSessionRevokeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke this session? The device will be signed out immediately.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSession && (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedSession.device_name}</p>
                <p className="text-sm text-gray-600">{selectedSession.ip_address}</p>
                <p className="text-sm text-gray-600">
                  Last active: <SessionTime timestamp={selectedSession.last_activity} />
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSessionRevokeDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedSession && revokeSession(selectedSession.id)}
            >
              Revoke Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
