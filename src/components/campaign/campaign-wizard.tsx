"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { CampaignWizardProps, CampaignFormData, ValidationError } from "@/types/campaign";

// Step Components
import { CampaignDetailsStep } from "./steps/campaign-details-step";
import { EmailDesignStep } from "./steps/email-design-step";
import { AudienceSelectionStep } from "./steps/audience-selection-step";
import { ScheduleDeliveryStep } from "./steps/schedule-delivery-step";
import { ReviewLaunchStep } from "./steps/review-launch-step";

export function CampaignWizard({
  currentStep,
  campaignData,
  onStepChange,
  onDataChange,
  onSuccess
}: CampaignWizardProps) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const validateStep = async (step: number, data: Partial<CampaignFormData>): Promise<boolean> => {
    setIsValidating(true);
    const stepErrors: ValidationError[] = [];

    try {
      switch (step) {
        case 1: // Campaign Details
          if (!data.name?.trim()) {
            stepErrors.push({ field: 'name', message: 'Campaign name is required' });
          }
          if (!data.subject?.trim()) {
            stepErrors.push({ field: 'subject', message: 'Subject line is required' });
          }
          if (!data.type) {
            stepErrors.push({ field: 'type', message: 'Campaign type is required' });
          }
          break;

        case 2: // Email Design
          if (!data.templateId && !data.customContent) {
            stepErrors.push({ field: 'template', message: 'Please select a template or add custom content' });
          }
          break;

        case 3: // Audience Selection
          if (!data.recipients?.length) {
            stepErrors.push({ field: 'recipients', message: 'Please select at least one recipient' });
          }
          break;

        case 4: // Schedule & Delivery
          if (!data.scheduleType) {
            stepErrors.push({ field: 'scheduleType', message: 'Please select a schedule type' });
          }
          if (data.scheduleType === 'scheduled' && !data.scheduledAt) {
            stepErrors.push({ field: 'scheduledAt', message: 'Please select a schedule date and time' });
          }
          break;

        case 5: // Review & Launch
          if (!data.complianceChecked) {
            stepErrors.push({ field: 'compliance', message: 'Please review compliance requirements' });
          }
          break;
      }

      setErrors(stepErrors);
      return stepErrors.length === 0;
    } finally {
      setIsValidating(false);
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep, campaignData);
    
    if (isValid) {
      onStepChange(currentStep + 1);
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };

  const handlePrevious = () => {
    onStepChange(currentStep - 1);
  };

  const handleDataUpdate = (stepData: Partial<CampaignFormData>) => {
    onDataChange(stepData);
    // Clear errors for updated fields
    const updatedFields = Object.keys(stepData);
    setErrors(prev => prev.filter(error => !updatedFields.includes(error.field)));
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 5;

  const getStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CampaignDetailsStep
            data={campaignData}
            errors={errors}
            onChange={handleDataUpdate}
          />
        );
      case 2:
        return (
          <EmailDesignStep
            data={campaignData}
            errors={errors}
            onChange={handleDataUpdate}
          />
        );
      case 3:
        return (
          <AudienceSelectionStep
            data={campaignData}
            errors={errors}
            onChange={handleDataUpdate}
          />
        );
      case 4:
        return (
          <ScheduleDeliveryStep
            data={campaignData}
            errors={errors}
            onChange={handleDataUpdate}
          />
        );
      case 5:
        return (
          <ReviewLaunchStep
            data={campaignData}
            errors={errors}
            onChange={handleDataUpdate}
            onSuccess={onSuccess}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Content */}
      <div className="min-h-[500px]">
        {getStepComponent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <div>
          {!isFirstStep && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="min-w-32"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isLastStep ? (
            <Button
              onClick={handleNext}
              disabled={isValidating}
              className="min-w-32 bg-blue-600 hover:bg-blue-700"
            >
              {isValidating ? (
                "Validating..."
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center text-sm text-green-600">
              <Check className="w-4 h-4 mr-2" />
              Ready to launch
            </div>
          )}
        </div>
      </div>

      {/* Error Summary */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            Please fix the following errors:
          </h4>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
