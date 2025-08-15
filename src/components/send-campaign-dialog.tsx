"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Send, Loader2, Users, Mail, FileText, Eye } from "lucide-react";
import { Campaign, Template } from "@/lib/emailtracker-api";
import { toast } from "sonner";
import emailTrackerAPI from "@/lib/emailtracker-api";

interface SendCampaignDialogProps {
  campaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SendCampaignDialog({ 
  campaign, 
  open,
  onOpenChange,
  onSuccess
}: SendCampaignDialogProps) {
  const [isSending, setIsSending] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  useEffect(() => {
    if (open && campaign) {
      loadTemplates();
    }
  }, [open, campaign]);

  const loadTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const templateData = await emailTrackerAPI.getTemplates({
        limit: 50
      });
      
      // Handle the expected TemplateList structure
      const templatesList = templateData?.templates || [];
      setTemplates(templatesList);
      
      // Auto-select first template if available
      if (templatesList.length > 0) {
        setSelectedTemplate(templatesList[0].id);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast.error('Failed to load templates');
      setTemplates([]);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleSend = async () => {
    if (!campaign) return;
    
    setIsSending(true);
    
    try {
      // If a template is selected, update the campaign first
      if (selectedTemplate && selectedTemplate !== campaign.template_id) {
        await emailTrackerAPI.updateCampaign(campaign.id, {
          template_id: selectedTemplate
        });
      }
      
      // Send campaign
      const response = await emailTrackerAPI.sendCampaign(campaign.id);
      
      toast.success(`Campaign "${campaign.name}" sent successfully!`, {
        description: response.sent_count 
          ? `Sent to ${response.sent_count} recipients`
          : `Campaign is being processed`
      });
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to send campaign:', error);
      toast.error('Failed to send campaign', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!campaign) return null;

  const selectedTemplateObj = templates.find(t => t.id === selectedTemplate);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Campaign Now
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Are you sure you want to send &ldquo;{campaign.name}&rdquo; immediately? 
                This action cannot be undone.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <Mail className="h-4 w-4" />
                  <span><strong>Subject:</strong> {campaign.subject}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <Users className="h-4 w-4" />
                  <span><strong>Recipients:</strong> {campaign.recipients_count} contacts</span>
                </div>
                
                {campaign.recipients_count === 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                    <p className="text-sm text-amber-800">
                      <strong>Warning:</strong> This campaign has no recipients selected. 
                      Please add recipients before sending.
                    </p>
                  </div>
                )}
              </div>

              {/* Template Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="h-4 w-4" />
                  Email Template
                </div>
                
                {isLoadingTemplates ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading templates...
                  </div>
                ) : templates.length > 0 ? (
                  <div className="space-y-3">
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Use campaign default content</option>
                      {templates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name} ({template.type})
                        </option>
                      ))}
                    </select>
                    
                    {selectedTemplateObj && (
                      <div className="bg-gray-50 border rounded-lg p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900">
                              {selectedTemplateObj.name}
                            </h4>
                            {selectedTemplateObj.description && (
                              <p className="text-xs text-gray-600 mt-1">
                                {selectedTemplateObj.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded capitalize">
                                {selectedTemplateObj.type}
                              </span>
                              <span className="text-xs text-gray-500">
                                Used {selectedTemplateObj.usage_count} times
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => {
                              // Could open template preview here
                              toast.info('Template preview feature coming soon');
                            }}
                          >
                            <Eye className="h-3 w-3" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No templates available. The campaign will use its default content.
                  </p>
                )}
              </div>
              
              <p className="text-sm text-gray-600">
                The campaign will be sent to all recipients immediately. You can track 
                the delivery progress and analytics in the dashboard.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSend}
            disabled={isSending || campaign.recipients_count === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Now
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
