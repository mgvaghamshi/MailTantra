"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Users, FileText } from "lucide-react";
import { TemplateSelector } from "./template-selector";
import { RecipientsSelector } from "./recipients-selector";
import emailTrackerAPI from "@/lib/emailtracker-api";
import { toast } from "sonner";
import type { Template, Contact } from "@/lib/emailtracker-api";

interface CampaignFormData {
  name: string;
  subject: string;
  description: string;
  templateId?: string;
  recipients: Contact[];
}

interface CampaignFormProps {
  onSuccess?: (campaignId: string) => void;
}

export function CampaignForm({ onSuccess }: CampaignFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<CampaignFormData>>({});
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    subject: "",
    description: "",
    templateId: "",
    recipients: [],
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<CampaignFormData> = {};

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

    if (formData.recipients.length === 0) {
      toast.error("Please select at least one recipient for your campaign");
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CampaignFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const campaignData = {
        name: formData.name.trim(),
        subject: formData.subject.trim(),
        description: formData.description.trim() || "",
        templateId: selectedTemplate?.id,
        recipients_count: formData.recipients.length,
        // Store recipients for future implementation
        metadata: {
          selectedRecipients: formData.recipients.map(r => r.id)
        }
      };

      const newCampaign = await emailTrackerAPI.createCampaign(campaignData);
      
      toast.success(`Campaign "${formData.name}" created successfully!`);

      // Reset form
      setFormData({
        name: "",
        subject: "",
        description: "",
        templateId: "",
        recipients: [],
      });
      setSelectedTemplate(null);
      setErrors({});
      
      // Call success callback
      onSuccess?.(newCampaign.id);
      
    } catch (error) {
      console.error("Failed to create campaign:", error);
      toast.error("Failed to create campaign. Please try again.");
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Campaign Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Campaign Details
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Basic information about your email campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                placeholder="Enter campaign name"
                className="w-full"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                aria-describedby={errors.name ? "name-error" : "name-description"}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-red-600">{errors.name}</p>
              )}
              <p id="name-description" className="text-sm text-muted-foreground">
                A descriptive name for your campaign
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject Line *</Label>
              <Input
                id="subject"
                placeholder="Enter email subject"
                className="w-full"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                aria-describedby={errors.subject ? "subject-error" : "subject-description"}
              />
              {errors.subject && (
                <p id="subject-error" className="text-sm text-red-600">{errors.subject}</p>
              )}
              <p id="subject-description" className="text-sm text-muted-foreground">
                The subject line recipients will see in their inbox
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional campaign description"
                className="w-full"
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                aria-describedby={errors.description ? "description-error" : "description-description"}
              />
              {errors.description && (
                <p id="description-error" className="text-sm text-red-600">{errors.description}</p>
              )}
              <p id="description-description" className="text-sm text-muted-foreground">
                Internal notes about this campaign (optional)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Email Template
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Choose an email template for your campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
              onTemplateRemove={handleTemplateRemove}
            />
          </CardContent>
        </Card>

        {/* Audience Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recipients
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Select the contacts who will receive this campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecipientsSelector
              selectedContacts={formData.recipients}
              onContactsChange={handleRecipientsChange}
              placeholder="Choose recipients for your campaign..."
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !formData.name.trim() || !formData.subject.trim() || formData.recipients.length === 0}
            className="min-w-32"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Campaign"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
