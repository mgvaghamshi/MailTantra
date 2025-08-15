"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, 
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useApiKeyManagement } from "@/hooks/use-emailtracker";
import { ApiKeyListItem } from "@/lib/emailtracker-api";

interface DeleteApiKeyModalProps {
  children: React.ReactNode;
  apiKey: ApiKeyListItem;
  onKeyDeleted?: () => void;
}

export function DeleteApiKeyModal({ children, apiKey, onKeyDeleted }: DeleteApiKeyModalProps) {
  const [open, setOpen] = useState(false);
  const { deleteApiKey, loading } = useApiKeyManagement();

  const handleDelete = async () => {
    try {
      await deleteApiKey(apiKey.id);
      if (onKeyDeleted) {
        onKeyDeleted();
      }
      setOpen(false);
    } catch (error) {
      console.error('Error deleting API key:', error);
      alert('Failed to delete API key. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Delete API Key</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-800">This action cannot be undone</span>
            </div>
            <p className="text-sm text-red-700">
              Deleting this API key will immediately revoke access. Any applications using this key will stop working.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">API Key to Delete</label>
              <div className="mt-1 p-3 bg-gray-50 border rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{apiKey.name}</p>
                    <p className="text-xs text-gray-500">Created {formatDate(apiKey.created_at)}</p>
                  </div>
                  <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                    {apiKey.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Rate Limit:</span>
                <p className="font-medium">{apiKey.requests_per_minute}/min</p>
              </div>
              <div>
                <span className="text-gray-500">Daily Limit:</span>
                <p className="font-medium">{apiKey.requests_per_day}/day</p>
              </div>
            </div>

            {apiKey.last_used_at && (
              <div className="text-sm">
                <span className="text-gray-500">Last used:</span>
                <p className="font-medium">{formatDate(apiKey.last_used_at)}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete API Key
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
