"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Key, 
  Plus, 
  Save,
  Loader2,
  Copy,
  CheckCircle,
  Info
} from "lucide-react";
import { useApiKeyManagement } from "@/hooks/use-emailtracker";
import { ApiKeyCreateResponse } from "@/lib/emailtracker-api";

interface CreateApiKeyModalProps {
  children: React.ReactNode;
  onKeyCreated?: (key: ApiKeyCreateResponse) => void;
}

export function CreateApiKeyModal({ children, onKeyCreated }: CreateApiKeyModalProps) {
  const [open, setOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { createApiKey, loading } = useApiKeyManagement();
  
  const [formData, setFormData] = useState({
    name: '',
    requests_per_minute: 100,
    requests_per_day: 10000,
    expires_in_days: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const keyData = {
        name: formData.name,
        requests_per_minute: formData.requests_per_minute,
        requests_per_day: formData.requests_per_day,
        expires_in_days: formData.expires_in_days ? parseInt(formData.expires_in_days) : undefined
      };
      
      const result = await createApiKey(keyData);
      
      if (result && result.key) {
        setNewApiKey(result.key);
        // Don't call onKeyCreated yet - wait until user copies the key
      } else {
        console.error('No API key in response or result is null:', result);
        alert('API key was created but no key was returned. Please check the backend response.');
      }
      
    } catch (error) {
      console.error('Error creating API key:', error);
      alert('Failed to create API key. Please try again.');
    }
  };

  const handleClose = () => {
    // Call onKeyCreated callback if we have a created key
    if (newApiKey && onKeyCreated) {
      // Create a mock result for the callback
      const mockResult: ApiKeyCreateResponse = {
        id: 'created',
        key: newApiKey,
        name: formData.name,
        user_id: undefined,
        is_active: true,
        created_at: new Date().toISOString(),
        last_used_at: undefined,
        expires_at: undefined,
        requests_per_minute: formData.requests_per_minute,
        requests_per_day: formData.requests_per_day
      };
      onKeyCreated(mockResult);
    }
    
    setOpen(false);
    setNewApiKey(null);
    setCopied(false);
    // Reset form when closing
    setFormData({
      name: '',
      requests_per_minute: 100,
      requests_per_day: 10000,
      expires_in_days: ''
    });
  };

  const copyToClipboard = async () => {
    if (newApiKey) {
      try {
        await navigator.clipboard.writeText(newApiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy key:', err);
      }
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Prevent closing if we have a new API key to show
      if (!newOpen && newApiKey) {
        return; // Don't close if we're showing the API key
      }
      setOpen(newOpen);
      if (!newOpen) {
        // Only reset when actually closing
        setNewApiKey(null);
        setCopied(false);
        setFormData({
          name: '',
          requests_per_minute: 100,
          requests_per_day: 10000,
          expires_in_days: ''
        });
      }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>{newApiKey ? 'API Key Created' : 'Create New API Key'}</span>
          </DialogTitle>
        </DialogHeader>

        {newApiKey ? (
          // Show the newly created API key
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">API Key Created Successfully!</span>
              </div>
              <p className="text-sm text-green-700">
                Your API key has been created. Please copy it now as it won&apos;t be shown again.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-api-key">Your New API Key</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="new-api-key"
                  value={newApiKey}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="icon"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                onClick={handleClose}
                variant={copied ? "default" : "outline"}
              >
                {copied ? "Done" : "I've Copied It"}
              </Button>
            </div>
          </div>
        ) : (
          // Show the creation form
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">API Key Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Production API, Development API"
                required
              />
              <p className="text-xs text-gray-500">
                Choose a descriptive name to help you identify this key later
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requests_per_minute">Requests per Minute</Label>
                <Input
                  id="requests_per_minute"
                  type="number"
                  min="1"
                  max="10000"
                  value={formData.requests_per_minute}
                  onChange={(e) => handleInputChange('requests_per_minute', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requests_per_day">Requests per Day</Label>
                <Input
                  id="requests_per_day"
                  type="number"
                  min="1"
                  max="1000000"
                  value={formData.requests_per_day}
                  onChange={(e) => handleInputChange('requests_per_day', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires_in_days">Expires in Days (Optional)</Label>
              <Input
                id="expires_in_days"
                type="number"
                min="1"
                max="3650"
                value={formData.expires_in_days}
                onChange={(e) => handleInputChange('expires_in_days', e.target.value)}
                placeholder="Leave empty for no expiration"
              />
              <p className="text-xs text-gray-500">
                Maximum 3,650 days (~10 years). Leave empty for permanent key.
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Security Notice</p>
                  <p>The API key will only be shown once after creation. Make sure to copy and store it securely.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !formData.name.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create API Key
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
