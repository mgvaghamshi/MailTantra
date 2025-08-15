"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Smartphone, 
  Monitor, 
  Mail,
  Loader2,
  Download,
  Send,
  Copy,
  Crown
} from "lucide-react";
import { Campaign, EmailPreview, emailTrackerAPI } from "@/lib/emailtracker-api";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { toast } from "sonner";

interface EmailPreviewDialogProps {
  campaign: Campaign;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variationId?: string;
}

export function EmailPreviewDialog({ 
  campaign, 
  open, 
  onOpenChange, 
  variationId 
}: EmailPreviewDialogProps) {
  const { hasAccess, getUpgradeMessage } = useUserPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<EmailPreview | null>(null);
  const [activeView, setActiveView] = useState<'desktop' | 'mobile'>('desktop');
  const [showPersonalized, setShowPersonalized] = useState(true);

  const canUseFeature = hasAccess('livePreview');

  useEffect(() => {
    if (open && canUseFeature) {
      loadPreview();
    }
  }, [open, campaign.id, variationId, canUseFeature]);

  const loadPreview = async () => {
    setIsLoading(true);
    try {
      const previewData = await emailTrackerAPI.getEmailPreview(campaign.id, variationId);
      setPreview(previewData);
    } catch (error) {
      console.error('Failed to load email preview:', error);
      toast.error('Failed to load email preview', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadHtml = () => {
    if (!preview) return;
    
    const content = showPersonalized && preview.personalized_content?.html
      ? preview.personalized_content.html 
      : preview.html_content;
    
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaign.name}-preview.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!canUseFeature) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              Basic Feature
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-center">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Email Preview</h3>
              <p className="text-sm text-gray-600 mb-4">
                Live email preview is available for all users! Please check your browser permissions.
              </p>
              <Button onClick={loadPreview} className="w-full">
                Try Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Email Preview: "{campaign.name}"
            {variationId && <Badge variant="outline">A/B Variation</Badge>}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
              <p className="text-gray-600">Loading email preview...</p>
            </div>
          </div>
        ) : preview ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Controls */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center bg-white rounded-lg border">
                  <Button
                    variant={activeView === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveView('desktop')}
                    className="flex items-center gap-1"
                  >
                    <Monitor className="h-4 w-4" />
                    Desktop
                  </Button>
                  <Button
                    variant={activeView === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveView('mobile')}
                    className="flex items-center gap-1"
                  >
                    <Smartphone className="h-4 w-4" />
                    Mobile
                  </Button>
                </div>

                {/* Personalization Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="personalized"
                    checked={showPersonalized}
                    onChange={(e) => setShowPersonalized(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="personalized" className="text-sm text-gray-700">
                    Show personalized content
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(
                    showPersonalized && preview.personalized_content?.html
                      ? preview.personalized_content.html 
                      : preview.html_content
                  )}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-4 w-4" />
                  Copy HTML
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadHtml}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>

            {/* Sample Data Display */}
            {showPersonalized && preview.personalized_content?.sample_data && (
              <div className="p-3 bg-blue-50 border-b">
                <div className="text-xs text-blue-800 mb-1">Sample personalization data:</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(preview.personalized_content.sample_data).map(([key, value]) => (
                    <Badge key={key} variant="outline" className="text-xs">
                      {key}: {value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Preview Frame */}
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              <div className={`mx-auto bg-white shadow-lg ${
                activeView === 'mobile' ? 'max-w-sm' : 'max-w-4xl'
              } transition-all duration-300`}>
                <div className="border rounded-lg overflow-hidden">
                  {/* Email Header */}
                  <div className="bg-gray-50 p-3 border-b text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">Subject:</span>
                      <span>{campaign.subject}</span>
                    </div>
                  </div>

                  {/* Email Content */}
                  <div 
                    className="p-4"
                    dangerouslySetInnerHTML={{ 
                      __html: showPersonalized && preview.personalized_content?.html
                        ? preview.personalized_content.html 
                        : preview.html_content 
                    }}
                    style={{
                      fontSize: activeView === 'mobile' ? '14px' : '16px',
                      lineHeight: '1.6'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Text Version */}
            <div className="border-t bg-gray-50 p-4">
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  View text version
                </summary>
                <div className="bg-white border rounded p-3 text-sm font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {showPersonalized && preview.personalized_content?.text
                    ? preview.personalized_content.text 
                    : preview.text_content}
                </div>
              </details>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">No Preview Available</h3>
              <p className="text-sm text-gray-600 mb-4">
                Unable to load email preview. Please try again.
              </p>
              <Button onClick={loadPreview}>
                Reload Preview
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
