"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Server, 
  Shield, 
  Bell,
  User,
  Database,
  Globe,
  Save,
  TestTube,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Trash2,
  Settings,
  Mail,
  Lock,
  Zap,
  BarChart3,
  Palette,
  Webhook,
  CreditCard,
  UserPlus,
  Clock,
  Eye,
  Target,
  Filter,
  Code,
  Headphones,
  Star,
  Crown
} from "lucide-react";
import { toast } from 'sonner';
import TwoFactorManager from '@/components/two-factor-manager';
import emailTrackerAPI, { 
  SmtpSettings, 
  CompanySettings, 
  SecuritySettings, 
  NotificationSettings, 
  StorageData, 
  DomainSettings,
  DomainStatus 
} from '@/lib/emailtracker-api';

interface AccountSettings {
  organizationName: string;
  contactEmail: string;
  timezone: string;
  language: string;
}

function SmtpSettingsCard() {
  const [settings, setSettings] = useState<SmtpSettings>({
    server: '',
    port: 587,
    security: 'TLS',
    username: '',
    password: '',
    isConnected: false
  });
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await emailTrackerAPI.getSmtpSettings();
      setSettings(data || settings);
      setPasswordChanged(false); // Reset password changed flag when loading settings
    } catch (error) {
      toast.error('Failed to load SMTP settings');
    } finally {
      setLoading(false);
    }
  };

  const validateSettings = () => {
    const newErrors: Record<string, string> = {};
    
    if (!settings.server.trim()) newErrors.server = 'SMTP server is required';
    if (settings.port < 1 || settings.port > 65535) newErrors.port = 'Port must be between 1 and 65535';
    if (!settings.username.trim()) newErrors.username = 'Username is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.username)) newErrors.username = 'Invalid email format';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveSettings = async () => {
    if (!validateSettings()) return;

    try {
      setSaving(true);
      // Only send the password if it has been changed
      const settingsToSave = { ...settings };
      if (!passwordChanged && settings.password === '••••••••') {
        // Don't send the masked password, let backend preserve existing password
        settingsToSave.password = '••••••••';
      }
      await emailTrackerAPI.updateSmtpSettings(settingsToSave);
      toast.success('SMTP settings saved successfully');
      setPasswordChanged(false); // Reset flag after successful save
    } catch (error) {
      toast.error('Failed to save SMTP settings');
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    if (!validateSettings()) return;

    try {
      setTesting(true);
      const result = await emailTrackerAPI.testSmtpConnection(settings);
      setSettings(prev => ({ ...prev, isConnected: result.success }));
      
      if (result.success) {
        toast.success('SMTP connection successful');
      } else {
        toast.error(`Connection failed: ${result.error}`);
      }
    } catch (error) {
      toast.error('Failed to test SMTP connection');
      setSettings(prev => ({ ...prev, isConnected: false }));
    } finally {
      setTesting(false);
    }
  };

  const updateField = (field: keyof SmtpSettings, value: any) => {
    if (field === 'password') {
      setPasswordChanged(true);
    }
    setSettings(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Server className="h-5 w-5 text-blue-600" />
          <CardTitle>SMTP Configuration</CardTitle>
        </div>
        <CardDescription>
          Configure your email server settings for sending emails
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">SMTP Server</label>
              <input
                type="text"
                placeholder="smtp.example.com"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.server ? 'border-red-500' : 'border-gray-300'
                }`}
                value={settings.server}
                onChange={(e) => updateField('server', e.target.value)}
                disabled={saving}
              />
              {errors.server && <p className="text-sm text-red-600">{errors.server}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Port</label>
                <input
                  type="number"
                  placeholder="587"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.port ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={settings.port}
                  onChange={(e) => updateField('port', parseInt(e.target.value) || 0)}
                  disabled={saving}
                />
                {errors.port && <p className="text-sm text-red-600">{errors.port}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Security</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={settings.security}
                  onChange={(e) => updateField('security', e.target.value)}
                  disabled={saving}
                >
                  <option value="TLS">TLS</option>
                  <option value="SSL">SSL</option>
                  <option value="NONE">None</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <input
                type="email"
                placeholder="your-email@example.com"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                value={settings.username}
                onChange={(e) => updateField('username', e.target.value)}
                disabled={saving}
              />
              {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={settings.password}
                onChange={(e) => updateField('password', e.target.value)}
                disabled={saving}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={testConnection}
                disabled={testing || saving}
              >
                {testing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <TestTube className="mr-2 h-4 w-4" />
                )}
                Test Connection
              </Button>
              <Badge 
                variant={settings.isConnected ? "default" : "secondary"}
                className={settings.isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
              >
                {settings.isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            
            <Button 
              onClick={saveSettings}
              disabled={saving}
              className="w-full"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save SMTP Settings
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function AccountSettingsCard() {
  const [settings, setSettings] = useState<CompanySettings>({
    company_name: '',
    company_website: '',
    company_logo: '',
    company_address: '',
    support_email: '',
    privacy_policy_url: '',
    terms_of_service_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await emailTrackerAPI.getCompanySettings();
      setSettings(data || settings);
    } catch (error) {
      toast.error('Failed to load company settings');
    } finally {
      setLoading(false);
    }
  };

  const validateSettings = () => {
    const newErrors: Record<string, string> = {};
    
    if (!settings.company_name.trim()) newErrors.company_name = 'Company name is required';
    if (!settings.support_email.trim()) newErrors.support_email = 'Support email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.support_email)) newErrors.support_email = 'Invalid email format';
    if (settings.company_website && !settings.company_website.startsWith('http')) newErrors.company_website = 'Website must start with http:// or https://';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveSettings = async () => {
    if (!validateSettings()) return;

    try {
      setSaving(true);
      await emailTrackerAPI.updateCompanySettings(settings);
      toast.success('Company settings saved successfully');
    } catch (error) {
      toast.error('Failed to save company settings');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof CompanySettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-green-600" />
          <CardTitle>Company Settings</CardTitle>
        </div>
        <CardDescription>
          Manage your company branding and contact information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <input
                type="text"
                placeholder="Your Company"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.company_name ? 'border-red-500' : 'border-gray-300'
                }`}
                value={settings.company_name}
                onChange={(e) => updateField('company_name', e.target.value)}
                disabled={saving}
              />
              {errors.company_name && <p className="text-sm text-red-600">{errors.company_name}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Support Email</label>
              <input
                type="email"
                placeholder="support@yourcompany.com"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.support_email ? 'border-red-500' : 'border-gray-300'
                }`}
                value={settings.support_email}
                onChange={(e) => updateField('support_email', e.target.value)}
                disabled={saving}
              />
              {errors.support_email && <p className="text-sm text-red-600">{errors.support_email}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Website</label>
              <input
                type="url"
                placeholder="https://yourcompany.com"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.company_website ? 'border-red-500' : 'border-gray-300'
                }`}
                value={settings.company_website}
                onChange={(e) => updateField('company_website', e.target.value)}
                disabled={saving}
              />
              {errors.company_website && <p className="text-sm text-red-600">{errors.company_website}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Address</label>
              <textarea
                placeholder="123 Business St, City, State 12345"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                value={settings.company_address}
                onChange={(e) => updateField('company_address', e.target.value)}
                disabled={saving}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Privacy Policy URL</label>
              <input
                type="url"
                placeholder="https://yourcompany.com/privacy"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={settings.privacy_policy_url}
                onChange={(e) => updateField('privacy_policy_url', e.target.value)}
                disabled={saving}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Terms of Service URL</label>
              <input
                type="url"
                placeholder="https://yourcompany.com/terms"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={settings.terms_of_service_url}
                onChange={(e) => updateField('terms_of_service_url', e.target.value)}
                disabled={saving}
              />
            </div>
            
            <Button 
              onClick={saveSettings}
              disabled={saving}
              className="w-full"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Company Settings
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function SecuritySettingsCard() {
  const [settings, setSettings] = useState({
    apiKeyRotationEnabled: false,
    sessionTimeout: 30
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await emailTrackerAPI.getSecuritySettings();
      setSettings({
        apiKeyRotationEnabled: data.apiKeyRotationEnabled || false,
        sessionTimeout: data.sessionTimeout || 30
      });
    } catch (error) {
      toast.error('Failed to load security settings');
    } finally {
      setLoading(false);
    }
  };

  const toggleApiRotation = async () => {
    try {
      setUpdating('rotation');
      const result = await emailTrackerAPI.toggleApiKeyRotation(!settings.apiKeyRotationEnabled);
      setSettings(prev => ({ ...prev, apiKeyRotationEnabled: result.enabled }));
      toast.success(`API key rotation ${result.enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update API key rotation');
    } finally {
      setUpdating(null);
    }
  };

  const updateSessionTimeout = async (timeout: number) => {
    try {
      setUpdating('timeout');
      await emailTrackerAPI.updateSessionTimeout(timeout);
      setSettings(prev => ({ ...prev, sessionTimeout: timeout }));
      toast.success('Session timeout updated');
    } catch (error) {
      toast.error('Failed to update session timeout');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-purple-600" />
          <CardTitle>Additional Security Settings</CardTitle>
        </div>
        <CardDescription>
          Configure additional security options for your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium">API Key Rotation</h4>
                <p className="text-sm text-gray-500">Automatically rotate keys monthly</p>
              </div>
              <button
                onClick={toggleApiRotation}
                disabled={updating === 'rotation'}
                className="relative inline-flex items-center cursor-pointer"
              >
                {updating === 'rotation' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className={`w-11 h-6 rounded-full transition-colors ${
                    settings.apiKeyRotationEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}>
                    <div className={`w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform ${
                      settings.apiKeyRotationEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    } mt-0.5`} />
                  </div>
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium">Session Timeout</h4>
                <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
              </div>
              <select 
                className="px-3 py-1 border border-gray-300 rounded text-sm"
                value={settings.sessionTimeout}
                onChange={(e) => updateSessionTimeout(parseInt(e.target.value))}
                disabled={updating === 'timeout'}
              >
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={240}>4 hours</option>
                <option value={0}>Never</option>
              </select>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function NotificationSettingsCard() {
  const [settings, setSettings] = useState<NotificationSettings>({
    campaignCompletion: true,
    highBounceRate: true,
    apiLimitWarnings: true,
    securityAlerts: true,
    weeklyReports: false,
    webhookUrl: '',
    emailNotifications: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await emailTrackerAPI.getNotificationSettings();
      setSettings(data || settings);
    } catch (error) {
      toast.error('Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await emailTrackerAPI.updateNotificationSettings(settings);
      toast.success('Notification settings saved successfully');
    } catch (error) {
      toast.error('Failed to save notification settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleNotification = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notifications = [
    { key: 'campaignCompletion', label: 'Campaign Completion', description: 'When email campaigns finish sending' },
    { key: 'highBounceRate', label: 'High Bounce Rate', description: 'When bounce rate exceeds threshold' },
    { key: 'apiLimitWarnings', label: 'API Limit Warnings', description: 'When approaching API rate limits' },
    { key: 'securityAlerts', label: 'Security Alerts', description: 'For login attempts and security events' },
    { key: 'weeklyReports', label: 'Weekly Reports', description: 'Automated performance summaries' }
  ] as const;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-orange-600" />
          <CardTitle>Notification Settings</CardTitle>
        </div>
        <CardDescription>
          Control when and how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium">{notification.label}</h4>
                    <p className="text-sm text-gray-500">{notification.description}</p>
                  </div>
                  <button
                    onClick={() => toggleNotification(notification.key)}
                    disabled={saving}
                    className="relative inline-flex items-center cursor-pointer"
                  >
                    <div className={`w-11 h-6 rounded-full transition-colors ${
                      settings[notification.key] ? 'bg-blue-600' : 'bg-gray-200'
                    }`}>
                      <div className={`w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform ${
                        settings[notification.key] ? 'translate-x-5' : 'translate-x-0.5'
                      } mt-0.5`} />
                    </div>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Webhook URL (optional)</label>
              <input
                type="url"
                placeholder="https://your-webhook.com/notifications"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={settings.webhookUrl || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                disabled={saving}
              />
            </div>
            
            <Button 
              onClick={saveSettings}
              disabled={saving}
              className="w-full"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Notification Settings
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function DataStorageCard() {
  const [storageData, setStorageData] = useState<StorageData>({
    used: 0,
    total: 100,
    campaigns: 0,
    contacts: 0,
    emailsSent: 0,
    retentionPeriod: 12,
    lastBackup: undefined,
    autoBackup: false
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      setLoading(true);
      const data = await emailTrackerAPI.getStorageData();
      setStorageData(data || storageData);
    } catch (error) {
      toast.error('Failed to load storage data');
    } finally {
      setLoading(false);
    }
  };

  const updateRetentionPeriod = async (months: number) => {
    try {
      await emailTrackerAPI.updateRetentionPeriod(months);
      setStorageData(prev => ({ ...prev, retentionPeriod: months }));
      toast.success('Data retention period updated');
    } catch (error) {
      toast.error('Failed to update retention period');
    }
  };

  const exportData = async () => {
    try {
      setExporting(true);
      const result = await emailTrackerAPI.exportData();
      
      // Update last backup time
      setStorageData(prev => ({ 
        ...prev, 
        lastBackup: new Date().toISOString() 
      }));
      
      // Create download
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Export completed! File: ${result.filename} (${(result as any).size})`);
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const deleteAllData = async () => {
    if (deleteConfirmation !== 'DELETE ALL MY DATA') {
      toast.error('Please type "DELETE ALL MY DATA" to confirm');
      return;
    }

    try {
      setDeleting(true);
      const result = await emailTrackerAPI.deleteAllData(deleteConfirmation);
      
      setStorageData(prev => ({ 
        ...prev, 
        used: 0, 
        campaigns: 0, 
        contacts: 0, 
        emailsSent: 0 
      }));
      setShowDeleteConfirm(false);
      setDeleteConfirmation('');
      
      toast.success(`All data deleted successfully! Deleted: ${result.deleted_records.campaigns} campaigns, ${result.deleted_records.contacts} contacts, ${result.deleted_records.email_trackers} emails`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete data');
    } finally {
      setDeleting(false);
    }
  };

  const usagePercentage = (storageData.used || 0) / (storageData.total || 1) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-indigo-600" />
          <CardTitle>Data & Storage</CardTitle>
        </div>
        <CardDescription>
          Manage data retention and storage preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Retention Period</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={storageData.retentionPeriod}
                onChange={(e) => updateRetentionPeriod(parseInt(e.target.value))}
              >
                <option value={6}>6 months</option>
                <option value={12}>1 year</option>
                <option value={24}>2 years</option>
                <option value={0}>Forever</option>
              </select>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Storage Used</span>
                <Badge variant="outline">
                  {(storageData.used || 0).toFixed(1)} MB / {storageData.total || 100} MB
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-600">
                {usagePercentage.toFixed(1)}% used
              </div>
            </div>

            {/* Data Summary */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{(storageData.campaigns || 0).toLocaleString()}</div>
                <div className="text-xs text-gray-600">Campaigns</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{(storageData.contacts || 0).toLocaleString()}</div>
                <div className="text-xs text-gray-600">Contacts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{(storageData.emailsSent || 0).toLocaleString()}</div>
                <div className="text-xs text-gray-600">Emails Sent</div>
              </div>
            </div>

            {/* Backup Info */}
            {storageData.lastBackup ? (
              <div className="text-sm text-gray-600">
                Last backup: {new Date(storageData.lastBackup).toLocaleString()}
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                No backups available
              </div>
            )}
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={exportData}
                disabled={exporting}
              >
                {exporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export Data
              </Button>
              
              {!showDeleteConfirm ? (
                <Button 
                  variant="outline" 
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete All Data
                </Button>
              ) : (
                <div className="space-y-3">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This action cannot be undone. All your campaigns, contacts, and email data will be permanently deleted.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Type "DELETE ALL MY DATA" to confirm:
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="DELETE ALL MY DATA"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmation('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive"
                      className="flex-1"
                      onClick={deleteAllData}
                      disabled={deleting || deleteConfirmation !== 'DELETE ALL MY DATA'}
                    >
                      {deleting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        'Confirm Delete'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function DomainSettingsCard() {
  const [settings, setSettings] = useState<DomainSettings>({
    trackingDomain: '',
    sendingDomain: ''
  });
  const [domainStatus, setDomainStatus] = useState<DomainStatus>({
    spf: 'pending',
    dkim: 'pending'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [domainsData, statusData] = await Promise.all([
        emailTrackerAPI.getDomainSettings(),
        emailTrackerAPI.getDomainStatus()
      ]);
      
      setSettings(domainsData);
      setDomainStatus(statusData);
    } catch (error) {
      toast.error('Failed to load domain settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await emailTrackerAPI.updateDomainSettings(settings);
      toast.success('Domain settings saved successfully');
    } catch (error) {
      toast.error('Failed to save domain settings');
    } finally {
      setSaving(false);
    }
  };

  const verifyDNS = async () => {
    try {
      setVerifying(true);
      const result = await emailTrackerAPI.verifyDnsRecords();
      setDomainStatus(result);
      toast.success('DNS verification completed');
    } catch (error) {
      toast.error('Failed to verify DNS records');
    } finally {
      setVerifying(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-cyan-600" />
          <CardTitle>Domain Settings</CardTitle>
        </div>
        <CardDescription>
          Configure custom domains and tracking settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tracking Domain</label>
              <input
                type="text"
                placeholder="track.yourdomain.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={settings.trackingDomain}
                onChange={(e) => setSettings(prev => ({ ...prev, trackingDomain: e.target.value }))}
                disabled={saving}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Sending Domain</label>
              <input
                type="text"
                placeholder="mail.yourdomain.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={settings.sendingDomain}
                onChange={(e) => setSettings(prev => ({ ...prev, sendingDomain: e.target.value }))}
                disabled={saving}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                {getStatusIcon(domainStatus.spf)}
                <div>
                  <h4 className="font-medium">SPF Record</h4>
                  <p className="text-sm text-gray-500">DNS verification status</p>
                </div>
              </div>
              {getStatusBadge(domainStatus.spf)}
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                {getStatusIcon(domainStatus.dkim)}
                <div>
                  <h4 className="font-medium">DKIM Record</h4>
                  <p className="text-sm text-gray-500">Email authentication</p>
                </div>
              </div>
              {getStatusBadge(domainStatus.dkim)}
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={verifyDNS}
                disabled={verifying}
              >
                {verifying ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Verify DNS Records'
                )}
              </Button>
              
              <Button 
                onClick={saveSettings}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Domain Settings
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Premium Settings Cards

function EmailTemplateSettingsCard() {
  const [settings, setSettings] = useState({
    defaultTemplate: 'modern',
    brandingEnabled: true,
    footerText: 'Powered by EmailTracker',
    logoUrl: '',
    primaryColor: '#3B82F6',
    fontFamily: 'Inter'
  });

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Palette className="h-5 w-5 text-purple-600" />
          <CardTitle>Email Templates</CardTitle>
        </div>
        <CardDescription>
          Customize email templates and branding
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Default Template</label>
          <Select value={settings.defaultTemplate} onChange={(e) => setSettings({...settings, defaultTemplate: e.target.value})}>
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
            <option value="newsletter">Newsletter</option>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Custom Branding</label>
            <p className="text-sm text-gray-500">Add your logo and colors</p>
          </div>
          <Switch
            checked={settings.brandingEnabled}
            onCheckedChange={(checked: boolean) => setSettings({...settings, brandingEnabled: checked})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Primary Color</label>
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
              className="w-full h-10 border rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Family</label>
            <Select value={settings.fontFamily} onChange={(e) => setSettings({...settings, fontFamily: e.target.value})}>
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
            </Select>
          </div>
        </div>

        <Button className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Template Settings
        </Button>
      </CardContent>
    </Card>
  );
}

function EmailValidationCard() {
  const [settings, setSettings] = useState({
    realTimeValidation: true,
    bounceHandling: true,
    suppressionList: true,
    doubleOptIn: false,
    domainBlacklist: ['tempmail.com', 'guerrillamail.com'],
    customValidationRules: ''
  });

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <CardTitle>Email Validation</CardTitle>
          <Badge variant="outline" className="ml-2">Premium</Badge>
        </div>
        <CardDescription>
          Ensure email deliverability and list hygiene
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Real-time Validation</label>
              <p className="text-sm text-gray-500">Validate emails at point of entry</p>
            </div>
            <Switch 
              checked={settings.realTimeValidation}
              onCheckedChange={(checked: boolean) => setSettings({...settings, realTimeValidation: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Bounce Handling</label>
              <p className="text-sm text-gray-500">Automatically handle bounced emails</p>
            </div>
            <Switch 
              checked={settings.bounceHandling}
              onCheckedChange={(checked: boolean) => setSettings({...settings, bounceHandling: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Double Opt-in</label>
              <p className="text-sm text-gray-500">Require email confirmation</p>
            </div>
            <Switch 
              checked={settings.doubleOptIn}
              onCheckedChange={(checked: boolean) => setSettings({...settings, doubleOptIn: checked})}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <label className="text-sm font-medium">Domain Blacklist</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {settings.domainBlacklist.map((domain, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {domain}
                <button className="ml-1 text-red-500">×</button>
              </Badge>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add domain to blacklist"
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>

        <Button className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Validation Settings
        </Button>
      </CardContent>
    </Card>
  );
}

function ApiKeyManagementCard() {
  const [keys, setKeys] = useState([
    { id: 1, name: 'Production API', key: 'et_prod_...', created: '2024-01-15', lastUsed: '2024-01-20', status: 'active' },
    { id: 2, name: 'Development API', key: 'et_dev_...', created: '2024-01-10', lastUsed: 'Never', status: 'inactive' }
  ]);

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-5 w-5 text-blue-600" />
            <CardTitle>API Keys</CardTitle>
          </div>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Create Key
          </Button>
        </div>
        <CardDescription>
          Manage API keys for system integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {keys.map((key) => (
            <div key={key.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium text-sm">{key.name}</p>
                    <p className="text-xs text-gray-500">Created: {key.created}</p>
                    <p className="text-xs text-gray-500">Last used: {key.lastUsed}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={key.status === 'active' ? 'default' : 'secondary'}>
                  {key.status}
                </Badge>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            API keys provide full access to your account. Keep them secure and rotate regularly.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function AuditLogCard() {
  const [logs] = useState([
    { id: 1, action: 'API Key Created', user: 'admin@company.com', timestamp: '2024-01-20 14:30:00', ip: '192.168.1.1' },
    { id: 2, action: 'SMTP Settings Updated', user: 'admin@company.com', timestamp: '2024-01-20 12:15:00', ip: '192.168.1.1' },
    { id: 3, action: 'User Login', user: 'admin@company.com', timestamp: '2024-01-20 09:00:00', ip: '192.168.1.1' }
  ]);

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Eye className="h-5 w-5 text-orange-600" />
          <CardTitle>Audit Log</CardTitle>
          <Badge variant="outline" className="ml-2">Enterprise</Badge>
        </div>
        <CardDescription>
          Track security events and system changes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg text-sm">
              <div className="flex-1">
                <p className="font-medium">{log.action}</p>
                <p className="text-gray-500">by {log.user}</p>
              </div>
              <div className="text-right text-xs text-gray-500">
                <p>{log.timestamp}</p>
                <p>{log.ip}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
          <Button variant="outline" className="flex-1">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Placeholder components for other premium features
function AlertThresholdsCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-red-600" />
          <CardTitle>Alert Thresholds</CardTitle>
          <Badge variant="outline" className="ml-2">Premium</Badge>
        </div>
        <CardDescription>
          Configure automatic alerts for key metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Set up intelligent alerts for bounce rates, open rates, and more.</p>
        <Button className="mt-4 w-full">Configure Alerts</Button>
      </CardContent>
    </Card>
  );
}

function WebhookSettingsCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Webhook className="h-5 w-5 text-purple-600" />
          <CardTitle>Webhooks</CardTitle>
        </div>
        <CardDescription>
          Real-time event notifications to your systems
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Configure webhooks for email events, campaign updates, and more.</p>
        <Button className="mt-4 w-full">Manage Webhooks</Button>
      </CardContent>
    </Card>
  );
}

function SlackIntegrationCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Headphones className="h-5 w-5 text-green-600" />
          <CardTitle>Slack Integration</CardTitle>
          <Badge variant="outline" className="ml-2">Premium</Badge>
        </div>
        <CardDescription>
          Get notifications in your Slack workspace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Receive campaign updates and alerts directly in Slack.</p>
        <Button className="mt-4 w-full">Connect Slack</Button>
      </CardContent>
    </Card>
  );
}

function AnalyticsSettingsCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <CardTitle>Analytics Settings</CardTitle>
        </div>
        <CardDescription>
          Configure tracking and analytics preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Customize your analytics dashboard and reporting.</p>
        <Button className="mt-4 w-full">Configure Analytics</Button>
      </CardContent>
    </Card>
  );
}

function ReportingScheduleCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-orange-600" />
          <CardTitle>Scheduled Reports</CardTitle>
          <Badge variant="outline" className="ml-2">Premium</Badge>
        </div>
        <CardDescription>
          Automate your reporting workflow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Schedule automatic reports to be sent to your team.</p>
        <Button className="mt-4 w-full">Schedule Reports</Button>
      </CardContent>
    </Card>
  );
}

function DataRetentionCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-gray-600" />
          <CardTitle>Data Retention</CardTitle>
        </div>
        <CardDescription>
          Manage data storage and retention policies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Configure how long to keep email tracking data.</p>
        <Button className="mt-4 w-full">Manage Retention</Button>
      </CardContent>
    </Card>
  );
}

function ExportSettingsCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Download className="h-5 w-5 text-green-600" />
          <CardTitle>Data Export</CardTitle>
        </div>
        <CardDescription>
          Export your data in various formats
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Export campaigns, contacts, and analytics data.</p>
        <Button className="mt-4 w-full">Export Data</Button>
      </CardContent>
    </Card>
  );
}

function CrmIntegrationsCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-purple-600" />
          <CardTitle>CRM Integrations</CardTitle>
          <Badge variant="outline" className="ml-2">Premium</Badge>
        </div>
        <CardDescription>
          Connect with popular CRM platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Integrate with Salesforce, HubSpot, Pipedrive, and more.</p>
        <Button className="mt-4 w-full">Browse Integrations</Button>
      </CardContent>
    </Card>
  );
}

function MarketingAutomationCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <CardTitle>Marketing Automation</CardTitle>
          <Badge variant="outline" className="ml-2">Enterprise</Badge>
        </div>
        <CardDescription>
          Advanced automation workflows
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Create sophisticated email automation workflows.</p>
        <Button className="mt-4 w-full">Setup Automation</Button>
      </CardContent>
    </Card>
  );
}

function ApiAccessCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Code className="h-5 w-5 text-gray-600" />
          <CardTitle>API Access</CardTitle>
        </div>
        <CardDescription>
          Developer tools and API documentation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Access our REST API and developer resources.</p>
        <Button className="mt-4 w-full">View Documentation</Button>
      </CardContent>
    </Card>
  );
}

function TeamManagementCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5 text-blue-600" />
          <CardTitle>Team Management</CardTitle>
          <Badge variant="outline" className="ml-2">Premium</Badge>
        </div>
        <CardDescription>
          Manage team members and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Add team members and configure role-based access.</p>
        <Button className="mt-4 w-full">Manage Team</Button>
      </CardContent>
    </Card>
  );
}

function ProfileSettingsCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-600" />
          <CardTitle>Profile Settings</CardTitle>
        </div>
        <CardDescription>
          Manage your personal account settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Update your profile information and preferences.</p>
        <Button className="mt-4 w-full">Edit Profile</Button>
      </CardContent>
    </Card>
  );
}

function SubscriptionManagementCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-600" />
          <CardTitle>Subscription</CardTitle>
        </div>
        <CardDescription>
          Manage your subscription and plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">View and modify your current subscription plan.</p>
        <Button className="mt-4 w-full">Manage Subscription</Button>
      </CardContent>
    </Card>
  );
}

function BillingOverviewCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <CardTitle>Billing Overview</CardTitle>
        </div>
        <CardDescription>
          View your billing summary and history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Monitor your usage and billing information.</p>
        <Button className="mt-4 w-full">View Billing</Button>
      </CardContent>
    </Card>
  );
}

function PaymentMethodsCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-green-600" />
          <CardTitle>Payment Methods</CardTitle>
        </div>
        <CardDescription>
          Manage your payment methods
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Add, edit, or remove payment methods.</p>
        <Button className="mt-4 w-full">Manage Payments</Button>
      </CardContent>
    </Card>
  );
}

function UsageMonitoringCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          <CardTitle>Usage Monitoring</CardTitle>
        </div>
        <CardDescription>
          Track your plan usage and limits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Monitor email sends, API calls, and other usage metrics.</p>
        <Button className="mt-4 w-full">View Usage</Button>
      </CardContent>
    </Card>
  );
}

function InvoiceHistoryCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Download className="h-5 w-5 text-gray-600" />
          <CardTitle>Invoice History</CardTitle>
        </div>
        <CardDescription>
          Download and manage your invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Access and download your billing history.</p>
        <Button className="mt-4 w-full">View Invoices</Button>
      </CardContent>
    </Card>
  );
}

function DeveloperSettingsCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Code className="h-5 w-5 text-purple-600" />
          <CardTitle>Developer Settings</CardTitle>
          <Badge variant="outline" className="ml-2">Advanced</Badge>
        </div>
        <CardDescription>
          Advanced developer configuration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">API rate limits, webhook signatures, and debug modes.</p>
        <Button className="mt-4 w-full">Developer Console</Button>
      </CardContent>
    </Card>
  );
}

function SystemConfigCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-gray-600" />
          <CardTitle>System Configuration</CardTitle>
          <Badge variant="outline" className="ml-2">Enterprise</Badge>
        </div>
        <CardDescription>
          System-wide configuration options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Configure system defaults and enterprise features.</p>
        <Button className="mt-4 w-full">System Settings</Button>
      </CardContent>
    </Card>
  );
}

function TroubleshootingCard() {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <CardTitle>Troubleshooting</CardTitle>
        </div>
        <CardDescription>
          Diagnostic tools and support resources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm">Run diagnostics and access support documentation.</p>
        <Button className="mt-4 w-full">Run Diagnostics</Button>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("email");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-600">
                    Configure your Mail Tantra account, SMTP settings, and system preferences
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Settings Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-b border-gray-200 bg-white rounded-lg p-1 shadow-sm">
            <TabsList className="grid w-full grid-cols-8 bg-transparent">
              <TabsTrigger value="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Email</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Integrations</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center space-x-2">
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline">Advanced</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Email Configuration */}
          <TabsContent value="email" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SmtpSettingsCard />
              <EmailTemplateSettingsCard />
              <DomainSettingsCard />
              <EmailValidationCard />
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TwoFactorManager />
              <SecuritySettingsCard />
              <ApiKeyManagementCard />
              <AuditLogCard />
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <NotificationSettingsCard />
              <AlertThresholdsCard />
              <WebhookSettingsCard />
              <SlackIntegrationCard />
            </div>
          </TabsContent>

          {/* Analytics & Reporting */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AnalyticsSettingsCard />
              <ReportingScheduleCard />
              <DataRetentionCard />
              <ExportSettingsCard />
            </div>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CrmIntegrationsCard />
              <MarketingAutomationCard />
              <WebhookSettingsCard />
              <ApiAccessCard />
            </div>
          </TabsContent>

          {/* Account Management */}
          <TabsContent value="account" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AccountSettingsCard />
              <TeamManagementCard />
              <ProfileSettingsCard />
              <SubscriptionManagementCard />
            </div>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <BillingOverviewCard />
              <PaymentMethodsCard />
              <UsageMonitoringCard />
              <InvoiceHistoryCard />
            </div>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <DeveloperSettingsCard />
              <DataStorageCard />
              <SystemConfigCard />
              <TroubleshootingCard />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
