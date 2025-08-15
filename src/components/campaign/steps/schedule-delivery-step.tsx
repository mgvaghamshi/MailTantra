"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Send, Repeat, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CampaignFormData, ScheduleType, ValidationError } from "@/types/campaign";

interface ScheduleDeliveryStepProps {
  data: Partial<CampaignFormData>;
  errors: ValidationError[];
  onChange: (data: Partial<CampaignFormData>) => void;
}

const scheduleOptions: Array<{
  type: ScheduleType;
  label: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
}> = [
  {
    type: "immediate",
    label: "Send Immediately",
    description: "Send the campaign right away",
    icon: <Send className="h-5 w-5" />
  },
  {
    type: "scheduled",
    label: "Schedule for Later",
    description: "Choose a specific date and time",
    icon: <Calendar className="h-5 w-5" />
  },
  {
    type: "recurring",
    label: "Recurring Campaign",
    description: "Send on a regular schedule",
    icon: <Repeat className="h-5 w-5" />,
    badge: "Premium"
  }
];

export function ScheduleDeliveryStep({ data, errors, onChange }: ScheduleDeliveryStepProps) {
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const getError = (field: string) => errors.find(e => e.field === field)?.message;

  const handleScheduleTypeChange = (type: ScheduleType) => {
    onChange({ scheduleType: type });
  };

  const handleDateTimeChange = () => {
    if (scheduledDate && scheduledTime) {
      const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      onChange({ scheduledAt: dateTime });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
          <Clock className="h-8 w-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Schedule & Delivery</h2>
        <p className="text-slate-600 max-w-lg mx-auto">
          Choose when to send your campaign and configure delivery settings for optimal performance.
        </p>
      </div>

      {/* Schedule Type Selection */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
        <CardHeader>
          <CardTitle>When to Send</CardTitle>
          <CardDescription>
            Choose the timing strategy that works best for your campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scheduleOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleScheduleTypeChange(option.type)}
                disabled={option.badge === "Premium"} // TODO: Check user plan
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 text-left relative",
                  "hover:shadow-md hover:scale-105",
                  data.scheduleType === option.type
                    ? "border-orange-500 bg-orange-50 shadow-lg"
                    : "border-slate-200 bg-white hover:border-slate-300",
                  option.badge === "Premium" && "opacity-60 cursor-not-allowed"
                )}
              >
                {option.badge && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500">
                    {option.badge}
                  </Badge>
                )}
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    data.scheduleType === option.type 
                      ? "bg-orange-100 text-orange-600" 
                      : "bg-slate-100 text-slate-600"
                  )}>
                    {option.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 mb-1">
                      {option.label}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {getError("scheduleType") && (
            <p className="text-sm text-red-600 mt-3">{getError("scheduleType")}</p>
          )}
        </CardContent>
      </Card>

      {/* Scheduled Date/Time Settings */}
      {data.scheduleType === "scheduled" && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Schedule Details
            </CardTitle>
            <CardDescription>
              Select the exact date and time for your campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-date">Date</Label>
                <Input
                  id="schedule-date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => {
                    setScheduledDate(e.target.value);
                    setTimeout(handleDateTimeChange, 0);
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-time">Time</Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => {
                    setScheduledTime(e.target.value);
                    setTimeout(handleDateTimeChange, 0);
                  }}
                  className="text-base"
                />
              </div>
            </div>

            {/* Timezone Display */}
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
              <Globe className="h-4 w-4" />
              <span>
                Campaign will be sent in your local timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </span>
            </div>

            {getError("scheduledAt") && (
              <p className="text-sm text-red-600">{getError("scheduledAt")}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delivery Settings */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
        <CardHeader>
          <CardTitle>Delivery Settings</CardTitle>
          <CardDescription>
            Configure how your emails are delivered for optimal performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Send Rate */}
          <div className="space-y-2">
            <Label htmlFor="send-rate">Send Rate (emails per hour)</Label>
            <Input
              id="send-rate"
              type="number"
              value={data.sendRate || 1000}
              onChange={(e) => onChange({ sendRate: parseInt(e.target.value) })}
              min={100}
              max={10000}
              step={100}
              className="text-base"
            />
            <p className="text-xs text-slate-500">
              Lower rates reduce server load but take longer to complete. 
              Recommended: 1000-2000 emails per hour.
            </p>
          </div>

          {/* Best Practices Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">📈 Optimal Send Times</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• <strong>Best days:</strong> Tuesday - Thursday</p>
              <p>• <strong>Best times:</strong> 10 AM - 12 PM, 2 PM - 4 PM</p>
              <p>• <strong>Avoid:</strong> Mondays, Fridays after 3 PM, weekends</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
