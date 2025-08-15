"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { History, Eye, RotateCcw, Calendar, User, FileText } from "lucide-react";
import { Campaign, CampaignVersion, emailTrackerAPI } from "@/lib/emailtracker-api";
import { toast } from "sonner";

interface VersionHistoryDialogProps {
  campaign: Campaign;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function VersionHistoryDialog({
  campaign,
  open,
  onOpenChange,
  onSuccess
}: VersionHistoryDialogProps) {
  const [versions, setVersions] = useState<CampaignVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<CampaignVersion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);

  // Load version history when dialog opens
  useEffect(() => {
    if (open) {
      loadVersionHistory();
    }
  }, [open]);

  const loadVersionHistory = async () => {
    try {
      setIsLoading(true);
      const data = await emailTrackerAPI.getCampaignVersions(campaign.id);
      setVersions(data);
    } catch (error) {
      console.error('Failed to load version history:', error);
      toast.error("Failed to load version history");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviewVersion = (version: CampaignVersion) => {
    setSelectedVersion(version);
    setShowPreviewDialog(true);
  };

  const handleRestoreVersion = (version: CampaignVersion) => {
    setSelectedVersion(version);
    setShowRestoreDialog(true);
  };

  const confirmRestore = async () => {
    if (!selectedVersion) return;

    try {
      setIsRestoring(true);
      await emailTrackerAPI.restoreCampaignVersion(campaign.id, selectedVersion.id);
      
      toast.success(`Campaign restored to version ${selectedVersion.version_number}`);
      
      setShowRestoreDialog(false);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to restore version:', error);
      toast.error("Failed to restore campaign version");
    } finally {
      setIsRestoring(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDisplayData = (version: CampaignVersion) => {
    // Extract data from snapshot_data or use defaults
    const snapshot = version.snapshot_data || {};
    return {
      name: snapshot.name || `Version ${version.version_number}`,
      subject: snapshot.subject || 'No subject',
      description: snapshot.description || '',
      created_by: version.created_by || 'Unknown',
      recipients_count: snapshot.recipients_count || 0
    };
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History - {campaign.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : versions.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No version history available</p>
                <p className="text-sm">Versions will be created as you make changes to your campaign</p>
              </div>
            ) : (
              <ScrollArea className="max-h-96">
                <div className="space-y-3">
                  {versions.map((version) => {
                    const displayData = getDisplayData(version);
                    return (
                      <div
                        key={version.id}
                        className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors"
                      >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono text-xs">
                              v{version.version_number}
                            </Badge>
                            <h4 className="font-medium text-neutral-900">
                              {displayData.name}
                            </h4>
                            {version.version_number === Math.max(...versions.map(v => v.version_number)) && (
                              <Badge variant="default" className="text-xs">
                                Latest
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-sm text-neutral-600">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {displayData.subject}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(version.created_at)}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {displayData.created_by}
                              </span>
                            </div>
                          </div>

                          {version.changes_summary && (
                            <p className="text-sm text-neutral-500 bg-neutral-50 rounded px-2 py-1">
                              {version.changes_summary}
                            </p>
                          )}

                          {displayData.recipients_count > 0 && (
                            <p className="text-xs text-neutral-400">
                              Recipients: {displayData.recipients_count} contacts
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreviewVersion(version)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestoreVersion(version)}
                            disabled={version.version_number === Math.max(...versions.map(v => v.version_number))}
                            className="flex items-center gap-1"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Restore
                          </Button>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Version Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Version {selectedVersion?.version_number} Preview
            </DialogTitle>
          </DialogHeader>

          {selectedVersion && (
            <ScrollArea className="max-h-96">
              <div className="space-y-4">
                {(() => {
                  const displayData = getDisplayData(selectedVersion);
                  return (
                    <>
                      <div>
                        <label className="text-sm font-medium text-neutral-700">Campaign Name</label>
                        <p className="text-sm text-neutral-900 bg-neutral-50 rounded px-3 py-2 mt-1">
                          {displayData.name}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-neutral-700">Subject</label>
                        <p className="text-sm text-neutral-900 bg-neutral-50 rounded px-3 py-2 mt-1">
                          {displayData.subject}
                        </p>
                      </div>

                      {displayData.description && (
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Description</label>
                          <p className="text-sm text-neutral-900 bg-neutral-50 rounded px-3 py-2 mt-1">
                            {displayData.description}
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="text-sm font-medium text-neutral-700">Recipients</label>
                        <p className="text-sm text-neutral-900 bg-neutral-50 rounded px-3 py-2 mt-1">
                          {displayData.recipients_count} contacts
                        </p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-blue-800">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">Version Details</span>
                        </div>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>Created: {formatDate(selectedVersion.created_at)}</p>
                          <p>Created by: {displayData.created_by}</p>
                          {selectedVersion.changes_summary && (
                            <p>Changes: {selectedVersion.changes_summary}</p>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </ScrollArea>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Campaign Version</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this campaign to version {selectedVersion?.version_number}?
              <br /><br />
              <strong>This will:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Create a backup of the current campaign state</li>
                <li>Restore the campaign name, subject, and description</li>
                <li>Restore the recipient list</li>
                <li>Create a new version with the restored content</li>
              </ul>
              <br />
              <strong>Note:</strong> This action cannot be undone, but you can always restore to any other version.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRestoring}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRestore}
              disabled={isRestoring}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRestoring ? "Restoring..." : "Restore Version"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
