"use client"

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApiKeys, useApiKeyManagement } from "@/hooks/use-emailtracker";
import { CreateApiKeyModal } from "@/components/api-keys/create-api-key-modal";
import { DeleteApiKeyModal } from "@/components/api-keys/delete-api-key-modal";
import { RateLimitedComponent } from "@/components/rate-limited-component";
import { 
  Key, 
  Plus, 
  Trash2,
  Calendar,
  Activity,
  AlertTriangle,
  Loader2
} from "lucide-react";

export default function ApiKeysPage() {
  const { data: apiKeys, loading, error, refresh } = useApiKeys();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <p className="text-gray-600">Manage your Mail Tantra API access keys and integration settings</p>
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
          <p className="text-gray-600">Manage your Mail Tantra API access keys and integration settings</p>
        </div>
        
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load API keys</h3>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <Button onClick={refresh} variant="outline">
                Try again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gray-600">
          Manage your Mail Tantra API access keys. Keep your keys secure and never share them publicly.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total API Keys</CardTitle>
            <Key className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeys?.length || 0}</div>
            <p className="text-xs text-gray-500">Active and inactive keys</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiKeys?.filter(key => key.is_active).length || 0}
            </div>
            <p className="text-xs text-gray-500">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limits</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiKeys?.[0]?.requests_per_minute || 100}/min
            </div>
            <p className="text-xs text-gray-500">Default rate limit</p>
          </CardContent>
        </Card>
      </div>

      {/* Create New Key Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Your API Keys</h2>
          <p className="text-sm text-gray-600">Create and manage your API access keys</p>
        </div>
        <RateLimitedComponent componentType="api-tool" disableWhenLimited={true}>
          <CreateApiKeyModal onKeyCreated={refresh}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create New Key
            </Button>
          </CreateApiKeyModal>
        </RateLimitedComponent>
      </div>

      {/* API Keys List */}
      {!apiKeys || apiKeys.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys found</h3>
              <p className="text-sm text-gray-600 mb-4">Create your first API key to get started</p>
              <RateLimitedComponent componentType="api-tool" disableWhenLimited={true}>
                <CreateApiKeyModal onKeyCreated={refresh}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create API Key
                  </Button>
                </CreateApiKeyModal>
              </RateLimitedComponent>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <Card key={apiKey.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Key className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{apiKey.name}</CardTitle>
                      <CardDescription>
                        Created {formatDate(apiKey.created_at)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                      {apiKey.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <DeleteApiKeyModal apiKey={apiKey} onKeyDeleted={refresh}>
                      <Button
                        variant="ghost"
                        size="icon"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </DeleteApiKeyModal>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* API Key */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">API Key</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="flex-1 px-3 py-2 bg-gray-100 rounded-md text-sm font-mono">
                        ••••••••••••••••••••••••••••••••
                      </code>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      API key is hidden for security. Key was only shown during creation.
                    </p>
                  </div>

                  {/* Rate Limits */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Rate Limits</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="px-3 py-2 bg-blue-50 rounded-md">
                        <p className="text-sm font-medium text-blue-700">{apiKey.requests_per_minute}/min</p>
                        <p className="text-xs text-blue-600">Per minute</p>
                      </div>
                      <div className="px-3 py-2 bg-green-50 rounded-md">
                        <p className="text-sm font-medium text-green-700">{apiKey.requests_per_day}/day</p>
                        <p className="text-xs text-green-600">Per day</p>
                      </div>
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">
                          {apiKey.last_used_at ? formatDate(apiKey.last_used_at) : 'Never'}
                        </p>
                        <p className="text-xs text-gray-500">Last used</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Key className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{formatDate(apiKey.created_at)}</p>
                        <p className="text-xs text-gray-500">Created</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
          <CardDescription>Get started with the EmailTracker API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-blue-600">1</span>
              </div>
              <div>
                <p className="text-sm font-medium">Copy your API key</p>
                <p className="text-xs text-gray-600">Use the copy button to get your API key</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-blue-600">2</span>
              </div>
              <div>
                <p className="text-sm font-medium">Include in your requests</p>
                <p className="text-xs text-gray-600">Add Authorization: Bearer YOUR_API_KEY to headers</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-blue-600">3</span>
              </div>
              <div>
                <p className="text-sm font-medium">Start sending requests</p>
                <p className="text-xs text-gray-600">Use our API endpoints to send and track emails</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <code className="text-sm text-blue-800">
              curl -H &quot;Authorization: Bearer YOUR_API_KEY&quot; {process.env.NEXT_PUBLIC_EMAILTRACKER_API_URL}/api/v1/emails/trackers
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
