"use client";

import React, { useState } from 'react';
import { RecurringScheduleConfig } from '@/components/campaign/recurring-schedule-config';
import type { CampaignFormData, ValidationError } from '@/types/campaign';

export default function RecurringScheduleDemo() {
  const [campaignData, setCampaignData] = useState<Partial<CampaignFormData>>({
    name: 'Demo Recurring Campaign',
    scheduleType: 'recurring'
  });
  
  const [errors] = useState<ValidationError[]>([]);

  const handleDataChange = (newData: Partial<CampaignFormData>) => {
    setCampaignData(prev => ({ ...prev, ...newData }));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Recurring Schedule Configuration</h1>
        <p className="text-gray-600">
          Production-grade recurring campaign scheduling with validation, RRULE generation, and preview.
        </p>
      </div>

      <RecurringScheduleConfig
        data={campaignData}
        errors={errors}
        onChange={handleDataChange}
      />

      {/* Debug Panel */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Current Configuration (Debug)</h3>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(campaignData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
