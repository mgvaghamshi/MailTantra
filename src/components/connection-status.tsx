'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import emailTrackerAPI from '@/lib/emailtracker-api';

interface ConnectionStatus {
  isConnected: boolean;
  apiUrl: string;
  hasApiKey: boolean;
  lastChecked: Date | null;
  error?: string;
  health?: {
    status: string;
    service?: string;
    version?: string;
    environment?: string;
    timestamp?: string;
  };
}

export default function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    apiUrl: process.env.NEXT_PUBLIC_EMAILTRACKER_API_URL || 'Not configured',
    hasApiKey: !!process.env.NEXT_PUBLIC_EMAILTRACKER_API_KEY,
    lastChecked: null,
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      // Test health endpoint
      const health = await emailTrackerAPI.healthCheck();
      
      // Test authenticated endpoint
      await emailTrackerAPI.getEmailTrackers();
      
      setStatus(prev => ({
        ...prev,
        isConnected: true,
        lastChecked: new Date(),
        error: undefined,
        health,
      }));
    } catch (error) {
      console.error('Connection test failed:', error);
      setStatus(prev => ({
        ...prev,
        isConnected: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusIcon = () => {
    if (isChecking) {
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
    }
    if (status.isConnected) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (!status.hasApiKey) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = () => {
    if (isChecking) return 'Checking...';
    if (status.isConnected) return 'Connected';
    if (!status.hasApiKey) return 'No API Key';
    return 'Disconnected';
  };

  const getStatusColor = () => {
    if (isChecking) return 'default';
    if (status.isConnected) return 'success';
    if (!status.hasApiKey) return 'warning';
    return 'destructive';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">EmailTracker Connection</CardTitle>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <Badge variant={getStatusColor() as "default" | "secondary" | "destructive" | "outline"}>
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">API URL:</span>
            <span className="font-mono text-xs">{status.apiUrl}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">API Key:</span>
            <span>{status.hasApiKey ? '✓ Configured' : '✗ Missing'}</span>
          </div>
          
          {status.health && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service:</span>
              <span>{status.health.service} v{status.health.version}</span>
            </div>
          )}
          
          {status.health && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Environment:</span>
              <span className="capitalize">{status.health.environment}</span>
            </div>
          )}
          
          {status.lastChecked && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Checked:</span>
              <span>{status.lastChecked.toLocaleTimeString()}</span>
            </div>
          )}
          
          {status.error && (
            <div className="text-red-500 text-xs mt-2 p-2 bg-red-50 rounded">
              <strong>Error:</strong> {status.error}
            </div>
          )}
          
          <Button 
            onClick={checkConnection} 
            disabled={isChecking}
            size="sm" 
            className="w-full mt-3"
          >
            {isChecking ? (
              <>
                <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3 mr-2" />
                Test Connection
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
