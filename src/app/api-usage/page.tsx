"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiKeys } from "@/hooks/use-emailtracker";
import { ApiKeyUsage } from "@/components/api-keys/api-key-usage";
import { 
  Activity, 
  Key,
  AlertTriangle,
  Loader2,
  TrendingUp,
  BarChart3
} from "lucide-react";

export default function ApiKeyUsagePage() {
  const { data: apiKeys, loading, error, refresh } = useApiKeys();

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Key Usage</h1>
          <p className="text-gray-600">Monitor your API key usage and rate limits</p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading API keys...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Key Usage</h1>
          <p className="text-gray-600">Monitor your API key usage and rate limits</p>
        </div>
        
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load API keys</h3>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <button 
                onClick={refresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeKeys = apiKeys?.filter(key => key.is_active) || [];
  const inactiveKeys = apiKeys?.filter(key => !key.is_active) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Key Usage</h1>
        <p className="text-gray-600">
          Monitor real-time usage statistics for all your API keys. Track rate limits, 
          usage patterns, and optimize your API consumption.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total API Keys</CardTitle>
            <Key className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeys?.length || 0}</div>
            <p className="text-xs text-gray-500">All keys in your account</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeKeys.length}</div>
            <p className="text-xs text-gray-500">Currently monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Keys</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">{inactiveKeys.length}</div>
            <p className="text-xs text-gray-500">Disabled or expired</p>
          </CardContent>
        </Card>
      </div>

      {/* Active API Keys Usage */}
      {activeKeys.length > 0 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Active API Keys</h2>
            <p className="text-sm text-gray-600">Real-time usage statistics for your active API keys</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeKeys.map((apiKey) => (
              <ApiKeyUsage 
                key={apiKey.id}
                apiKeyId={apiKey.id}
                apiKeyName={apiKey.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Inactive Keys Info */}
      {inactiveKeys.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-gray-400" />
              <span>Inactive API Keys</span>
            </CardTitle>
            <CardDescription>
              These keys are disabled and not generating usage statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inactiveKeys.map((apiKey) => (
                <div key={apiKey.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Key className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{apiKey.name}</p>
                      <p className="text-sm text-gray-500">
                        Created {new Date(apiKey.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Inactive
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No API Keys */}
      {(!apiKeys || apiKeys.length === 0) && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys found</h3>
              <p className="text-sm text-gray-600 mb-4">Create your first API key to start monitoring usage</p>
              <a
                href="/api-keys"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Key className="h-4 w-4 mr-2" />
                Create API Key
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding API Key Usage</CardTitle>
          <CardDescription>
            Learn how to interpret your usage statistics and optimize your API consumption
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Rate Limits</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-green-600">•</span>
                  <span><strong>Per-minute:</strong> Short-term burst protection</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600">•</span>
                  <span><strong>Per-day:</strong> Daily usage allocation</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-600">•</span>
                  <span><strong>70-90%:</strong> Consider optimization</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-600">•</span>
                  <span><strong>90%+:</strong> Risk of rate limiting</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Best Practices</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600">•</span>
                  <span>Implement exponential backoff for retries</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600">•</span>
                  <span>Cache responses when possible</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600">•</span>
                  <span>Monitor usage patterns regularly</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-600">•</span>
                  <span>Use multiple keys for different services</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
