"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Save, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Crown,
  Loader2
} from "lucide-react";
import { Campaign, emailTrackerAPI } from "@/lib/emailtracker-api";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { toast } from "sonner";

interface AutoSaveIndicatorProps {
  campaign: Campaign;
  isDirty: boolean;
  onSaveComplete?: () => void;
  className?: string;
}

export function AutoSaveIndicator({ 
  campaign, 
  isDirty, 
  onSaveComplete,
  className = ""
}: AutoSaveIndicatorProps) {
  const { hasAccess } = useUserPermissions();
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveDataRef = useRef<string>('');

  const canUseFeature = hasAccess('autoSave');

  useEffect(() => {
    if (!canUseFeature || !isDirty) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save (3 seconds after last change)
    saveTimeoutRef.current = setTimeout(() => {
      handleAutoSave();
    }, 3000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isDirty, campaign, canUseFeature]);

  useEffect(() => {
    // Load last auto-save data on mount
    if (canUseFeature) {
      loadAutoSaveData();
    }
  }, [campaign.id, canUseFeature]);

  const loadAutoSaveData = async () => {
    try {
      const autoSaveData = await emailTrackerAPI.getAutoSaveData(campaign.id);
      if (autoSaveData) {
        setLastSaved(new Date(autoSaveData.last_saved_at));
        lastSaveDataRef.current = JSON.stringify(autoSaveData.draft_content);
      }
    } catch (error) {
      // Auto-save data might not exist, which is fine
      // Silently handle missing auto-save data
    }
  };

  const handleAutoSave = async () => {
    if (!canUseFeature) return;

    const currentData = JSON.stringify({
      name: campaign.name,
      subject: campaign.subject,
      description: campaign.description,
      status: campaign.status
    });

    // Don't save if data hasn't changed
    if (currentData === lastSaveDataRef.current) {
      return;
    }

    setStatus('saving');

    try {
      await emailTrackerAPI.autoSaveCampaign(campaign.id, {
        name: campaign.name,
        subject: campaign.subject,
        description: campaign.description,
        status: campaign.status
      });

      setStatus('saved');
      setLastSaved(new Date());
      lastSaveDataRef.current = currentData;
      
      // Reset to idle after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);

      onSaveComplete?.();
    } catch (error) {
      setStatus('error');
      console.error('Auto-save failed:', error);
      
      // Show error toast only if it's not a network issue
      if (error instanceof Error && !error.message.includes('network')) {
        toast.error('Auto-save failed', {
          description: 'Your changes may not be saved automatically'
        });
      }

      // Reset to idle after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return null;
    
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    return lastSaved.toLocaleDateString();
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'saving':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
      case 'saved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Save className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      case 'error':
        return 'Save failed';
      default:
        return 'Auto-save';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'saving':
        return 'text-blue-600';
      case 'saved':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  if (!canUseFeature) {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <Crown className="h-4 w-4 text-amber-500" />
        <span className="text-gray-500">Auto-save disabled</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {getStatusIcon()}
      <span className={getStatusColor()}>
        {getStatusText()}
      </span>
      {lastSaved && status === 'idle' && (
        <>
          <span className="text-gray-400">•</span>
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="h-3 w-3" />
            <span className="text-xs">
              Last saved {formatLastSaved()}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
