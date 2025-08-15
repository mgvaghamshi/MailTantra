"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { RecipientsSelector } from "../recipients-selector";
import type { CampaignFormData, ValidationError } from "@/types/campaign";

interface AudienceSelectionStepProps {
  data: Partial<CampaignFormData>;
  errors: ValidationError[];
  onChange: (data: Partial<CampaignFormData>) => void;
}

export function AudienceSelectionStep({ data, errors, onChange }: AudienceSelectionStepProps) {
  const getError = (field: string) => errors.find(e => e.field === field)?.message;

  const handleRecipientsChange = (recipients: any[]) => {
    onChange({ recipients });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Users className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Audience Selection</h2>
        <p className="text-slate-600 max-w-lg mx-auto">
          Choose who will receive your campaign. You can select individual contacts or entire lists.
        </p>
      </div>

      {/* Recipients Selection */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
        <CardHeader>
          <CardTitle>Select Recipients</CardTitle>
          <CardDescription>
            Choose the contacts who will receive this campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecipientsSelector
            selectedContacts={data.recipients || []}
            onContactsChange={handleRecipientsChange}
            placeholder="Choose recipients for your campaign..."
          />
          {getError("recipients") && (
            <p className="text-sm text-red-600 mt-3">{getError("recipients")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
