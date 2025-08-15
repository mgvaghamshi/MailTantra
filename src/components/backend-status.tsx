"use client"

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHealthCheck } from "@/hooks/use-emailtracker";
import { 
  Server, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Loader2,
  ExternalLink 
} from "lucide-react";

export function BackendStatus() {
  const { data: health, loading, error, refresh } = useHealthCheck();

  const getStatusBadge = () => {
    if (loading) {
      return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Checking...</Badge>;
    }
    if (error) {
      return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Offline</Badge>;
    }
    if (health) {
      return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Online</Badge>;
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  const getStatusIcon = () => {
    if (loading) {
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
    if (error) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
    if (health) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <Server className="h-5 w-5 text-gray-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span>Backend Status</span>
          </div>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">
              EmailTracker API: <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {process.env.NEXT_PUBLIC_EMAILTRACKER_API_URL || 'http://localhost:8001'}
              </code>
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <p className="text-sm font-medium text-red-800">Connection Failed</p>
              </div>
              <p className="text-sm text-red-600 mb-3">{error}</p>
              <div className="space-y-2 text-xs text-red-600">
                <p>• Make sure the EmailTracker backend is running</p>
                <p>• Check if the API URL is correct in your environment variables</p>
                <p>• Verify your API key is valid</p>
              </div>
            </div>
          )}

          {health && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <p className="text-sm font-medium text-green-800">Connected Successfully</p>
              </div>
              <p className="text-sm text-green-600">
                Last checked: {health.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'Now'}
              </p>
            </div>
          )}

          <div className="flex space-x-2">
            <Button 
              onClick={refresh} 
              variant="outline" 
              size="sm"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test Connection
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(process.env.NEXT_PUBLIC_EMAILTRACKER_API_URL + '/docs', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              API Docs
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
