"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CampaignWizard } from "@/components/campaign/campaign-wizard";
import { CampaignProgress } from "@/components/campaign/campaign-progress";
import { toast } from "sonner";
import type { CampaignFormData } from "@/types/campaign";

export default function CreateCampaignPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState<Partial<CampaignFormData>>({});
  const [isDraft, setIsDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 5;

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleDataChange = (data: Partial<CampaignFormData>) => {
    setCampaignData((prev: Partial<CampaignFormData>) => ({ ...prev, ...data }));
  };

  const handleSaveDraft = async () => {
    setIsDraft(true);
    try {
      // Save as draft logic
      toast.success("Campaign saved as draft");
    } catch (error) {
      toast.error("Failed to save draft");
    } finally {
      setIsDraft(false);
    }
  };

  const handleLaunchCampaign = async () => {
    setIsSubmitting(true);
    try {
      // Launch campaign logic
      toast.success("Campaign launched successfully!");
      router.push("/campaigns");
    } catch (error) {
      toast.error("Failed to launch campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCampaignCreated = (campaignId: string) => {
    router.push(`/campaigns`);
  };

  const isLastStep = currentStep === totalSteps;
  const stepTitles = [
    "Campaign Details",
    "Email Design", 
    "Audience Selection",
    "Schedule & Delivery",
    "Review & Launch"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/campaigns">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Campaigns
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-300" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Create New Campaign</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1">
                Draft
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={isDraft}
                className="min-w-24"
              >
                <Save className="w-4 h-4 mr-2" />
                {isDraft ? "Saving..." : "Save Draft"}
              </Button>
              {isLastStep && (
                <Button
                  onClick={handleLaunchCampaign}
                  disabled={isSubmitting}
                  className="min-w-32 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Launching..." : "Launch Campaign"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <CampaignProgress 
            currentStep={currentStep} 
            totalSteps={totalSteps}
            stepTitles={stepTitles}
            onStepClick={handleStepChange}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Wizard Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <CampaignWizard
                  currentStep={currentStep}
                  campaignData={campaignData}
                  onStepChange={handleStepChange}
                  onDataChange={handleDataChange}
                  onSuccess={handleCampaignCreated}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Campaign Summary */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Campaign Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Name:</span>
                    <span className="font-medium text-slate-900 truncate ml-2">
                      {campaignData.name || "Untitled Campaign"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-medium text-slate-900">
                      {campaignData.type || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Recipients:</span>
                    <span className="font-medium text-slate-900">
                      {campaignData.recipients?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Template:</span>
                    <span className="font-medium text-slate-900">
                      {campaignData.templateId ? "Selected" : "None"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips & Guidelines */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 mb-4">💡 Pro Tips</h3>
                <div className="space-y-3 text-sm text-blue-800">
                  {currentStep === 1 && (
                    <>
                      <p>• Use descriptive campaign names for easy identification</p>
                      <p>• Keep subject lines under 50 characters for better mobile display</p>
                      <p>• Add tags to organize your campaigns</p>
                    </>
                  )}
                  {currentStep === 2 && (
                    <>
                      <p>• Choose mobile-responsive templates</p>
                      <p>• Preview your email on different devices</p>
                      <p>• Use personalization for better engagement</p>
                    </>
                  )}
                  {currentStep === 3 && (
                    <>
                      <p>• Segment your audience for targeted messaging</p>
                      <p>• Clean your contact list regularly</p>
                      <p>• Test with a small group first</p>
                    </>
                  )}
                  {currentStep === 4 && (
                    <>
                      <p>• Schedule for optimal engagement times</p>
                      <p>• Consider your audience's timezone</p>
                      <p>• Set up A/B testing for better results</p>
                    </>
                  )}
                  {currentStep === 5 && (
                    <>
                      <p>• Double-check all links and content</p>
                      <p>• Send a test email to yourself</p>
                      <p>• Monitor campaign performance closely</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    📚 View Documentation
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    💬 Contact Support
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    🎥 Watch Tutorial
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
