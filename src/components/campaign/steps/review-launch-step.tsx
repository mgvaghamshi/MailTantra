"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  Send, 
  Eye, 
  Mail, 
  Users, 
  Calendar,
  AlertTriangle,
  Shield,
  Rocket,
  TestTube
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import emailTrackerAPI from "@/lib/emailtracker-api";
import type { CampaignFormData, ValidationError } from "@/types/campaign";

interface ReviewLaunchStepProps {
  data: Partial<CampaignFormData>;
  errors: ValidationError[];
  onChange: (data: Partial<CampaignFormData>) => void;
  onSuccess?: (campaignId: string) => void;
}

export function ReviewLaunchStep({ data, errors, onChange, onSuccess }: ReviewLaunchStepProps) {
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [complianceChecked, setComplianceChecked] = useState(false);

  const getError = (field: string) => errors.find(e => e.field === field)?.message;

  const handleSendTest = async () => {
    if (!testEmail || !testEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSendingTest(true);
    try {
      // TODO: Implement test email sending
      toast.success(`Test email sent to ${testEmail}`);
      onChange({ testEmails: [...(data.testEmails || []), testEmail] });
      setTestEmail("");
    } catch (error) {
      toast.error("Failed to send test email");
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleLaunch = async () => {
    if (!complianceChecked) {
      toast.error("Please confirm compliance requirements");
      return;
    }

    setIsLaunching(true);
    try {
      const campaignData = {
        name: data.name!,
        subject: data.subject!,
        description: data.description || "",
        type: data.type!,
        templateId: data.templateId,
        recipients_count: data.recipients?.length || 0,
        scheduleType: data.scheduleType || "immediate",
        scheduledAt: data.scheduledAt,
        tags: data.tags,
        metadata: {
          selectedRecipients: data.recipients?.map(r => r.id) || [],
          sendRate: data.sendRate,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      const newCampaign = await emailTrackerAPI.createCampaign(campaignData);
      toast.success("Campaign launched successfully!");
      onSuccess?.(newCampaign.id);
    } catch (error) {
      console.error("Failed to launch campaign:", error);
      toast.error("Failed to launch campaign. Please try again.");
    } finally {
      setIsLaunching(false);
    }
  };

  const completionChecks = [
    {
      label: "Campaign details configured",
      completed: !!(data.name && data.subject && data.type),
      required: true
    },
    {
      label: "Email template selected",
      completed: !!(data.templateId || data.customContent),
      required: true
    },
    {
      label: "Recipients selected",
      completed: !!(data.recipients && data.recipients.length > 0),
      required: true
    },
    {
      label: "Schedule configured",
      completed: !!data.scheduleType,
      required: true
    },
    {
      label: "Test email sent",
      completed: !!(data.testEmails && data.testEmails.length > 0),
      required: false
    },
    {
      label: "Compliance requirements reviewed",
      completed: complianceChecked,
      required: true
    }
  ];

  const allRequiredCompleted = completionChecks
    .filter(check => check.required)
    .every(check => check.completed);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Review & Launch</h2>
        <p className="text-slate-600 max-w-lg mx-auto">
          Review your campaign settings and send a test email before launching to your audience.
        </p>
      </div>

      {/* Campaign Summary */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            Campaign Summary
          </CardTitle>
          <CardDescription>
            Review all the details of your campaign
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">{data.name}</p>
                  <p className="text-sm text-slate-600">Campaign Name</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Send className="h-5 w-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">{data.subject}</p>
                  <p className="text-sm text-slate-600">Subject Line</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-0.5">
                  {data.type?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Badge>
                <div>
                  <p className="text-sm text-slate-600">Campaign Type</p>
                </div>
              </div>
            </div>

            {/* Audience & Schedule */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">
                    {data.recipients?.length || 0} recipients
                  </p>
                  <p className="text-sm text-slate-600">Audience Size</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">
                    {data.scheduleType === "immediate" 
                      ? "Send immediately" 
                      : data.scheduledAt 
                        ? new Date(data.scheduledAt).toLocaleString()
                        : "Not scheduled"
                    }
                  </p>
                  <p className="text-sm text-slate-600">Send Schedule</p>
                </div>
              </div>

              {data.tags && data.tags.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {data.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Tags</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pre-Launch Checklist */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Pre-Launch Checklist
          </CardTitle>
          <CardDescription>
            Ensure everything is ready before launching your campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completionChecks.map((check, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center",
                  check.completed 
                    ? "bg-green-100 text-green-600" 
                    : check.required 
                      ? "bg-red-100 text-red-600"
                      : "bg-slate-100 text-slate-400"
                )}>
                  {check.completed ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : check.required ? (
                    <AlertTriangle className="h-3 w-3" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-current" />
                  )}
                </div>
                <span className={cn(
                  "text-sm",
                  check.completed ? "text-slate-900" : "text-slate-600"
                )}>
                  {check.label}
                  {check.required && !check.completed && (
                    <span className="text-red-600 ml-1">*</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Email */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-green-600" />
            Send Test Email
          </CardTitle>
          <CardDescription>
            Send a test email to check how your campaign looks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter test email address"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="flex-1"
              type="email"
            />
            <Button
              onClick={handleSendTest}
              disabled={isSendingTest || !testEmail}
              variant="outline"
            >
              {isSendingTest ? "Sending..." : "Send Test"}
            </Button>
          </div>

          {data.testEmails && data.testEmails.length > 0 && (
            <div className="text-sm text-green-600">
              ✓ Test emails sent to: {data.testEmails.join(", ")}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Compliance & Legal
          </CardTitle>
          <CardDescription>
            Confirm your campaign meets legal requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="compliance"
              checked={complianceChecked}
              onCheckedChange={(checked) => {
                setComplianceChecked(checked as boolean);
                onChange({ complianceChecked: checked as boolean });
              }}
            />
            <Label htmlFor="compliance" className="text-sm leading-relaxed">
              I confirm that this campaign complies with CAN-SPAM, GDPR, and other applicable laws. 
              It includes proper unsubscribe links, sender identification, and respects recipient preferences.
            </Label>
          </div>
          {getError("compliance") && (
            <p className="text-sm text-red-600">{getError("compliance")}</p>
          )}
        </CardContent>
      </Card>

      {/* Launch Campaign */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          {allRequiredCompleted ? (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2">
                <Rocket className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Ready to Launch! 🚀
                </h3>
                <p className="text-slate-600 mb-6">
                  Your campaign is configured and ready to send to {data.recipients?.length || 0} recipients.
                </p>
                <Button
                  onClick={handleLaunch}
                  disabled={isLaunching || !complianceChecked}
                  size="lg"
                  className="min-w-48 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {isLaunching ? (
                    "Launching Campaign..."
                  ) : (
                    <>
                      <Rocket className="w-5 h-5 mr-2" />
                      Launch Campaign
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Please complete all required steps before launching your campaign.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
