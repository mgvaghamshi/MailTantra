"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Users, FileText } from "lucide-react";
import { Campaign, Template, Contact } from "@/lib/emailtracker-api";
import { toast } from "sonner";
import emailTrackerAPI from "@/lib/emailtracker-api";
import { TemplateSelector } from "./campaign/template-selector";
import { RecipientsSelector } from "./campaign/recipients-selector";

interface EditCampaignDialogProps {
  campaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface EditFormData {
  name: string;
  subject: string;
  description: string;
  templateId?: string;
  recipients: Contact[];
}

export function EditCampaignDialog({ 
  campaign, 
  open,
  onOpenChange,
  onSuccess
}: EditCampaignDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<EditFormData>({
    name: "",
    subject: "",
    description: "",
    templateId: "",
    recipients: [],
  });
  const [errors, setErrors] = useState<Partial<EditFormData>>({});

  useEffect(() => {
    if (open && campaign) {
      // Initialize form data with campaign values
      setFormData({
        name: campaign.name,
        subject: campaign.subject,
        description: campaign.description || "",
        templateId: campaign.template_id || "",
        recipients: [], // Will be loaded separately
      });
      
      // Load recipients
      loadCampaignRecipients();
    }
  }, [open, campaign]);

  const loadCampaignRecipients = async () => {
    if (!campaign) return;
    
    try {
      // For now, we'll load all contacts and mark selected ones
      // In a real implementation, you'd have an endpoint to get campaign recipients
      const contactsData = await emailTrackerAPI.getContacts({
        limit: 1000
      });
      
      // This is a placeholder - you'd need to implement getting actual campaign recipients
      setFormData(prev => ({ ...prev, recipients: [] }));
    } catch (error) {
      console.error('Failed to load campaign recipients:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EditFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Campaign name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Campaign name must be less than 100 characters";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Email subject is required";
    } else if (formData.subject.length > 200) {
      newErrors.subject = "Subject must be less than 200 characters";
    }

    if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof EditFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!campaign || !validateForm()) return;
    
    setIsSaving(true);
    
    try {
      const updateData = {
        name: formData.name.trim(),
        subject: formData.subject.trim(),
        description: formData.description.trim() || "",
        template_id: selectedTemplate?.id || formData.templateId,
        metadata: {
          selectedRecipients: formData.recipients.map(r => r.id)
        }
      };

      await emailTrackerAPI.updateCampaign(campaign.id, updateData);
      
      toast.success(`Campaign "${formData.name}" updated successfully!`);
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to update campaign:', error);
      toast.error('Failed to update campaign', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setFormData(prev => ({ ...prev, templateId: template.id }));
    
    // Auto-fill subject if empty and template has one
    if (!formData.subject && template.subject) {
      handleInputChange("subject", template.subject);
    }
  };

  const handleTemplateRemove = () => {
    setSelectedTemplate(null);
    setFormData(prev => ({ ...prev, templateId: "" }));
  };

  const handleRecipientsChange = (recipients: Contact[]) => {
    setFormData(prev => ({ ...prev, recipients }));
  };

  if (!campaign) return null;

  // Only allow editing draft campaigns
  const canEdit = campaign.status === 'draft';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Edit Campaign
          </DialogTitle>
          <DialogDescription>
            {canEdit 
              ? "Make changes to your campaign details, template, and recipients."
              : "This campaign cannot be edited as it has already been sent or is currently sending."
            }
          </DialogDescription>
        </DialogHeader>

        {canEdit ? (
          <div className="space-y-6">
            {/* Campaign Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Campaign Name *</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter campaign name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-subject">Email Subject Line *</Label>
                <Input
                  id="edit-subject"
                  placeholder="Enter email subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                />
                {errors.subject && (
                  <p className="text-sm text-red-600">{errors.subject}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Optional campaign description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>

            {/* Template Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4" />
                Email Template
              </div>
              <TemplateSelector
                onTemplateSelect={handleTemplateSelect}
                onTemplateRemove={handleTemplateRemove}
                selectedTemplate={selectedTemplate}
              />
            </div>

            {/* Recipients Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Users className="h-4 w-4" />
                Campaign Recipients
              </div>
              <RecipientsSelector
                selectedContacts={formData.recipients}
                onContactsChange={handleRecipientsChange}
              />
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>This campaign cannot be edited because it has already been sent or is currently being sent.</p>
            <p className="text-sm mt-2">You can duplicate this campaign to create a new editable version.</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {canEdit && (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
