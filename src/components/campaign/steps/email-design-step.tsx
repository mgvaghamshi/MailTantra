"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette } from "lucide-react";
import { TemplateSelector } from "../template-selector";
import type { CampaignFormData, ValidationError } from "@/types/campaign";

interface EmailDesignStepProps {
  data: Partial<CampaignFormData>;
  errors: ValidationError[];
  onChange: (data: Partial<CampaignFormData>) => void;
}

export function EmailDesignStep({ data, errors, onChange }: EmailDesignStepProps) {
  const getError = (field: string) => errors.find(e => e.field === field)?.message;

  const handleTemplateSelect = (template: any) => {
    onChange({ 
      templateId: template.id,
      selectedTemplate: template 
    });
  };

  const handleTemplateRemove = () => {
    onChange({ 
      templateId: undefined,
      selectedTemplate: undefined 
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Palette className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Design</h2>
        <p className="text-slate-600 max-w-lg mx-auto">
          Choose a professional template or create custom content for your email campaign.
        </p>
      </div>

      {/* Template Selection */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
        <CardHeader>
          <CardTitle>Select Email Template</CardTitle>
          <CardDescription>
            Choose from our professionally designed templates or start from scratch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TemplateSelector
            selectedTemplate={data.selectedTemplate || null}
            onTemplateSelect={handleTemplateSelect}
            onTemplateRemove={handleTemplateRemove}
          />
          {getError("template") && (
            <p className="text-sm text-red-600 mt-3">{getError("template")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
