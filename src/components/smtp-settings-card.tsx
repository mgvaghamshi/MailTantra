"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, Eye, EyeOff, TestTube } from 'lucide-react'
// import { useToast } from "@/hooks/use-toast"

interface SmtpSettings {
  server: string
  port: number
  username: string
  password: string
  security: 'SSL' | 'TLS' | 'None'
  isConnected?: boolean
}

export function SmtpSettingsCard() {
  // const { toast } = useToast()
  const toast = ({ title, description, variant }: any) => {
    console.log('Toast:', { title, description, variant })
  }
  const [settings, setSettings] = useState<SmtpSettings>({
    server: '',
    port: 587,
    username: '',
    password: '',
    security: 'TLS'
  })
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; error?: string } | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Load settings on component mount
  useEffect(() => {
    loadSmtpSettings()
  }, [])

  const loadSmtpSettings = async () => {
    try {
      setLoading(true)
      // For development, we'll use mock data since auth isn't set up yet
      // In production, this would be: const response = await fetch('/api/settings/smtp', { headers: { 'Authorization': `Bearer ${token}` } })
      
      // Mock data for development
      const mockData: SmtpSettings = {
        server: 'smtp.gmail.com',
        port: 587,
        username: 'your-email@gmail.com',
        password: '••••••••',
        security: 'TLS' as const,
        isConnected: false
      }
      
      setSettings(mockData)
      
      toast({
        title: "Settings loaded",
        description: "SMTP settings loaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load SMTP settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof SmtpSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
    setTestResult(null) // Clear test result when settings change
  }

  const handleSecurityChange = (value: string) => {
    const securityType = value as 'SSL' | 'TLS' | 'None'
    setSettings(prev => ({ 
      ...prev, 
      security: securityType,
      port: securityType === 'SSL' ? 465 : securityType === 'TLS' ? 587 : 25
    }))
    setHasChanges(true)
  }

  const testConnection = async () => {
    try {
      setTesting(true)
      setTestResult(null)

      // For development, simulate API call
      // In production: const response = await fetch('/api/settings/smtp/test', { method: 'POST', body: JSON.stringify(settings) })
      
      // Simulate test delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock test result
      const mockResult = Math.random() > 0.5 
        ? { success: true }
        : { success: false, error: 'Authentication failed: Invalid username or password' }
      
      setTestResult(mockResult)
      
      if (mockResult.success) {
        toast({
          title: "Connection successful",
          description: "SMTP connection test passed",
        })
        setSettings(prev => ({ ...prev, isConnected: true }))
      } else {
        toast({
          title: "Connection failed",
          description: mockResult.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      setTestResult({ success: false, error: 'Network error occurred' })
      toast({
        title: "Test failed",
        description: "Failed to test SMTP connection",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  const saveSettings = async () => {
    try {
      setLoading(true)
      
      // For development, simulate save
      // In production: const response = await fetch('/api/settings/smtp', { method: 'PUT', body: JSON.stringify(settings) })
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setHasChanges(false)
      toast({
        title: "Settings saved",
        description: "SMTP settings updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save SMTP settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getConnectionStatus = () => {
    if (testResult?.success) {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>
    } else if (testResult?.success === false) {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>
    } else if (settings.isConnected) {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>
    } else {
      return <Badge variant="secondary">Not tested</Badge>
    }
  }

  if (loading && !hasChanges) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>SMTP Configuration</CardTitle>
          <CardDescription>Configure your email server settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading settings...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          SMTP Configuration
          {getConnectionStatus()}
        </CardTitle>
        <CardDescription>
          Configure your email server settings to send campaigns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Server Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtp-server">SMTP Server</Label>
            <Input
              id="smtp-server"
              placeholder="smtp.gmail.com"
              value={settings.server}
              onChange={(e) => handleInputChange('server', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-port">Port</Label>
            <Input
              id="smtp-port"
              type="number"
              placeholder="587"
              value={settings.port}
              onChange={(e) => handleInputChange('port', parseInt(e.target.value) || 587)}
            />
          </div>
        </div>

        {/* Authentication */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtp-username">Username</Label>
            <Input
              id="smtp-username"
              placeholder="your-email@gmail.com"
              value={settings.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-password">Password</Label>
            <div className="relative">
              <Input
                id="smtp-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Your app password"
                value={settings.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="space-y-2">
          <Label htmlFor="smtp-security">Security</Label>
          <select
            id="smtp-security"
            value={settings.security}
            onChange={(e) => handleSecurityChange(e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="TLS">TLS (Port 587)</option>
            <option value="SSL">SSL (Port 465)</option>
            <option value="None">None (Port 25)</option>
          </select>
        </div>

        {/* Test Result */}
        {testResult && !testResult.success && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Connection failed:</strong> {testResult.error}
            </AlertDescription>
          </Alert>
        )}

        {testResult && testResult.success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Connection successful!</strong> Your SMTP settings are working correctly.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={testConnection}
            disabled={testing || !settings.server || !settings.username}
            variant="outline"
            className="flex-1"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4 mr-2" />
                Test Connection
              </>
            )}
          </Button>
          
          <Button
            onClick={saveSettings}
            disabled={loading || !hasChanges}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Gmail users:</strong> Use your app password instead of your regular password.</p>
          <p><strong>Office 365:</strong> Enable SMTP AUTH in your admin settings.</p>
          <p><strong>Custom servers:</strong> Contact your email provider for SMTP settings.</p>
        </div>
      </CardContent>
    </Card>
  )
}
