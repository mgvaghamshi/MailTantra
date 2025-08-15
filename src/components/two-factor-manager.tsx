"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, ShieldCheck, ShieldAlert, QrCode, Copy, Download, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import emailTrackerAPI from '@/lib/emailtracker-api';

interface TwoFactorManagerProps {
  className?: string;
}

export default function TwoFactorManager({ className }: TwoFactorManagerProps) {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [setupData, setSetupData] = useState<any>(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isDisableOpen, setIsDisableOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secretVisible, setSecretVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    load2FAStatus();
  }, []);

  const load2FAStatus = async () => {
    try {
      setLoading(true);
      const data = await emailTrackerAPI.get2FAStatus();
      setStatus(data);
    } catch (error) {
      toast.error('Failed to load 2FA status');
    } finally {
      setLoading(false);
    }
  };

  const start2FASetup = async () => {
    try {
      setUpdating(true);
      const data = await emailTrackerAPI.setup2FA();
      setSetupData(data);
      
      // Get QR code image
      try {
        const qrBlob = await emailTrackerAPI.get2FAQRCode();
        const qrUrl = URL.createObjectURL(qrBlob);
        setQrCodeUrl(qrUrl);
      } catch (error) {
        console.error('Failed to load QR code:', error);
      }
      
      setIsSetupOpen(true);
      setStep(1);
    } catch (error) {
      toast.error('Failed to start 2FA setup');
    } finally {
      setUpdating(false);
    }
  };

  const verify2FASetup = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    try {
      setUpdating(true);
      const response = await emailTrackerAPI.verify2FASetup(verificationCode);
      
      if (response.success) {
        toast.success('Two-factor authentication enabled successfully!');
        setIsSetupOpen(false);
        setStep(1);
        setVerificationCode('');
        await load2FAStatus();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to verify 2FA setup');
    } finally {
      setUpdating(false);
    }
  };

  const disable2FA = async () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    try {
      setUpdating(true);
      const response = await emailTrackerAPI.disable2FA(password, verificationCode);
      
      if (response.success) {
        toast.success('Two-factor authentication disabled');
        setIsDisableOpen(false);
        setPassword('');
        setVerificationCode('');
        await load2FAStatus();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to disable 2FA');
    } finally {
      setUpdating(false);
    }
  };

  const regenerateBackupCodes = async () => {
    try {
      setUpdating(true);
      const response = await emailTrackerAPI.regenerateBackupCodes();
      
      // Update setup data with new backup codes
      setSetupData((prev: any) => ({
        ...prev,
        backup_codes: response.backup_codes
      }));
      
      toast.success('New backup codes generated');
      setShowBackupCodes(true);
      await load2FAStatus();
    } catch (error) {
      toast.error('Failed to generate backup codes');
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadBackupCodes = () => {
    if (!setupData?.backup_codes) return;
    
    const content = setupData.backup_codes.map((code: string, index: number) => 
      `${index + 1}. ${code}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emailtracker-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Backup codes downloaded');
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isEnabled = status?.is_enabled || false;
  const isVerified = status?.is_verified || false;
  const backupCodesRemaining = status?.backup_codes_remaining || 0;

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Two-Factor Authentication
            </div>
            <div className="flex items-center gap-2">
              {isEnabled && isVerified && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Enabled
                </Badge>
              )}
              {isEnabled && !isVerified && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <ShieldAlert className="h-3 w-3 mr-1" />
                  Setup Required
                </Badge>
              )}
              {!isEnabled && (
                <Badge variant="outline">
                  <Shield className="h-3 w-3 mr-1" />
                  Disabled
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Add an extra layer of security to your account with time-based one-time passwords (TOTP).
          </p>

          {isEnabled && isVerified && (
            <div className="space-y-3">
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertDescription>
                  Two-factor authentication is active. You have {backupCodesRemaining} backup codes remaining.
                  {status?.last_used_at && (
                    <span className="block mt-1 text-xs text-gray-500">
                      Last used: {new Date(status.last_used_at).toLocaleString()}
                    </span>
                  )}
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={regenerateBackupCodes}
                  disabled={updating}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate Backup Codes
                </Button>

                <Dialog open={isDisableOpen} onOpenChange={setIsDisableOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Disable 2FA
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Alert>
                        <ShieldAlert className="h-4 w-4" />
                        <AlertDescription>
                          This will disable two-factor authentication for your account. 
                          You'll need to enter your password and a 2FA code to confirm.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Current Password</label>
                          <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your current password"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">2FA Code (optional)</label>
                          <Input
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="000000"
                            maxLength={8}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter a 6-digit code from your authenticator app or 8-digit backup code
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDisableOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={disable2FA}
                          disabled={updating || !password}
                        >
                          {updating ? 'Disabling...' : 'Disable 2FA'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}

          {!isEnabled && (
            <div className="space-y-3">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Two-factor authentication is not enabled. Enable it now for enhanced security.
                </AlertDescription>
              </Alert>

              <Button onClick={start2FASetup} disabled={updating}>
                <Shield className="h-4 w-4 mr-2" />
                {updating ? 'Setting up...' : 'Enable 2FA'}
              </Button>
            </div>
          )}

          {/* Setup Dialog */}
          <Dialog open={isSetupOpen} onOpenChange={setIsSetupOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
              </DialogHeader>

              <Tabs value={`step-${step}`} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="step-1">1. Scan QR Code</TabsTrigger>
                  <TabsTrigger value="step-2">2. Verify Setup</TabsTrigger>
                  <TabsTrigger value="step-3">3. Backup Codes</TabsTrigger>
                </TabsList>

                <TabsContent value="step-1" className="space-y-4">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>

                    {qrCodeUrl && (
                      <div className="flex justify-center">
                        <img 
                          src={qrCodeUrl} 
                          alt="2FA QR Code" 
                          className="border rounded-lg p-4 bg-white"
                          style={{ maxWidth: '256px', maxHeight: '256px' }}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">
                        Can't scan? Enter this code manually:
                      </p>
                      <div className="flex items-center gap-2 justify-center">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {secretVisible ? setupData?.secret : '••••••••••••••••'}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSecretVisible(!secretVisible)}
                        >
                          {secretVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(setupData?.secret || '')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Button onClick={() => setStep(2)}>
                      Continue to Verification
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="step-2" className="space-y-4">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Enter the 6-digit code from your authenticator app to verify the setup.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Verification Code</label>
                        <Input
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="000000"
                          className="text-center text-lg tracking-widest font-mono"
                          maxLength={6}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button
                        onClick={verify2FASetup}
                        disabled={updating || verificationCode.length !== 6}
                      >
                        {updating ? 'Verifying...' : 'Verify & Enable'}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="step-3" className="space-y-4">
                  <div className="space-y-4">
                    <Alert>
                      <Download className="h-4 w-4" />
                      <AlertDescription>
                        Save these backup codes in a secure location. You can use them to access your account if you lose your authenticator device.
                      </AlertDescription>
                    </Alert>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                        {setupData?.backup_codes?.map((code: string, index: number) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                            <span>{index + 1}. {code}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(code)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={downloadBackupCodes}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Codes
                      </Button>
                      <Button onClick={() => {
                        setIsSetupOpen(false);
                        setStep(1);
                        toast.success('2FA setup completed successfully!');
                      }}>
                        Complete Setup
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          {/* Backup Codes Dialog */}
          {showBackupCodes && setupData?.backup_codes && (
            <Dialog open={showBackupCodes} onOpenChange={setShowBackupCodes}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Backup Codes Generated</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Alert>
                    <Download className="h-4 w-4" />
                    <AlertDescription>
                      Your old backup codes are now invalid. Save these new codes in a secure location.
                    </AlertDescription>
                  </Alert>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 gap-2 font-mono text-sm">
                      {setupData.backup_codes.map((code: string, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                          <span>{index + 1}. {code}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={downloadBackupCodes}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={() => setShowBackupCodes(false)}>
                      Done
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
