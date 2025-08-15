"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Clock, Loader2, Globe } from "lucide-react";
import { Campaign } from "@/lib/emailtracker-api";
import { toast } from "sonner";
import emailTrackerAPI from "@/lib/emailtracker-api";

// Common timezone options with UTC offsets
const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC (±00:00)', offset: '+00:00' },
  { value: 'America/New_York', label: 'New York (EST/EDT)', offset: '-05:00/-04:00' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)', offset: '-06:00/-05:00' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)', offset: '-07:00/-06:00' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', offset: '-08:00/-07:00' },
  { value: 'America/Toronto', label: 'Toronto (EST/EDT)', offset: '-05:00/-04:00' },
  { value: 'America/Vancouver', label: 'Vancouver (PST/PDT)', offset: '-08:00/-07:00' },
  { value: 'Europe/London', label: 'London (GMT/BST)', offset: '+00:00/+01:00' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: '+01:00/+02:00' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', offset: '+01:00/+02:00' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)', offset: '+01:00/+02:00' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)', offset: '+01:00/+02:00' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: '+09:00' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: '+08:00' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', offset: '+08:00' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)', offset: '+08:00' },
  { value: 'Asia/Kolkata', label: 'Mumbai/Kolkata (IST)', offset: '+05:30' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: '+04:00' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', offset: '+10:00/+11:00' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)', offset: '+10:00/+11:00' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)', offset: '+12:00/+13:00' },
];

interface ScheduleCampaignDialogProps {
  campaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ScheduleCampaignDialog({ 
  campaign, 
  open,
  onOpenChange,
  onSuccess
}: ScheduleCampaignDialogProps) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState("");

  // Auto-detect user's timezone
  const detectedTimezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'UTC';
    }
  }, []);

  // Initialize timezone
  useEffect(() => {
    if (!selectedTimezone) {
      setSelectedTimezone(detectedTimezone);
    }
  }, [detectedTimezone, selectedTimezone]);

  // Helper function to convert local datetime to UTC
  const convertToUTC = (dateStr: string, timeStr: string, timezone: string): Date => {
    try {
      // Create a date object assuming the input is in the specified timezone
      const localDateTime = new Date(`${dateStr}T${timeStr}`);
      
      // Get timezone offset for the selected timezone
      const tempDate = new Date();
      const utcTime = tempDate.getTime() + (tempDate.getTimezoneOffset() * 60000);
      
      // Create date in selected timezone
      const targetTime = new Date(utcTime + (getTimezoneOffset(timezone) * 60000));
      
      // Calculate the difference and adjust
      const offsetDiff = targetTime.getTimezoneOffset() - localDateTime.getTimezoneOffset();
      
      return new Date(localDateTime.getTime() - (offsetDiff * 60000));
    } catch {
      // Fallback: assume local timezone
      return new Date(`${dateStr}T${timeStr}`);
    }
  };

  // Simple timezone offset calculation (approximate)
  const getTimezoneOffset = (timezone: string): number => {
    try {
      const now = new Date();
      const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
      
      // Create a date in the target timezone
      const targetDate = new Date(utc.toLocaleString("en-US", {timeZone: timezone}));
      const localDate = new Date(utc.toLocaleString());
      
      return (localDate.getTime() - targetDate.getTime()) / 60000;
    } catch {
      return 0; // Default to UTC
    }
  };

  const isValidDateTime = () => {
    if (!selectedDate || !selectedTime || !selectedTimezone) return false;
    
    try {
      const scheduledDateTime = convertToUTC(selectedDate, selectedTime, selectedTimezone);
      const now = new Date();
      const minDateTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
      
      return scheduledDateTime > minDateTime;
    } catch {
      return false;
    }
  };

  const getMinDateTime = () => {
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    
    // Format in local time (we'll let the user input in their selected timezone)
    return {
      date: fiveMinutesFromNow.toISOString().split('T')[0],
      time: fiveMinutesFromNow.toTimeString().slice(0, 5)
    };
  };

  const getScheduledTimePreview = () => {
    if (!selectedDate || !selectedTime || !selectedTimezone) return null;
    
    try {
      const utcDate = convertToUTC(selectedDate, selectedTime, selectedTimezone);
      const localDateString = `${selectedDate} ${selectedTime}`;
      
      return {
        userTime: `${localDateString} (${selectedTimezone})`,
        utcTime: utcDate.toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        timestamp: utcDate
      };
    } catch {
      return null;
    }
  };

  const getCurrentTimeInTimezone = () => {
    if (!selectedTimezone) return '';
    
    try {
      const now = new Date();
      return now.toLocaleString("en-US", {
        timeZone: selectedTimezone,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '';
    }
  };

  const handleSchedule = async () => {
    if (!campaign) return;
    
    if (!isValidDateTime()) {
      toast.error("Please select a valid future date and time (at least 5 minutes from now)");
      return;
    }

    setIsScheduling(true);
    
    try {
      // Convert to UTC for the API
      const utcDate = convertToUTC(selectedDate, selectedTime, selectedTimezone);
      const scheduledAt = utcDate.toISOString();
      
      const response = await emailTrackerAPI.scheduleCampaign(campaign.id, scheduledAt, selectedTimezone);
      
      // Check if response has message field (success case) or handle success field
      if (response.message || response.success) {
        const preview = getScheduledTimePreview();
        toast.success(`Campaign "${campaign.name}" scheduled successfully!`, {
          description: preview ? `Will be sent on ${preview.userTime}` : `Will be sent on ${new Date(scheduledAt).toLocaleString()}`
        });
        onOpenChange(false);
        onSuccess?.();
        
        // Reset form
        setSelectedDate("");
        setSelectedTime("");
        // Keep timezone selected for user convenience
      } else {
        throw new Error(response.error || "Failed to schedule campaign");
      }
    } catch (error) {
      console.error("Failed to schedule campaign:", error);
      toast.error("Failed to schedule campaign", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setSelectedDate("");
      setSelectedTime("");
      // Keep timezone for user convenience
    } else {
      // Set default values when opening
      const minDateTime = getMinDateTime();
      setSelectedDate(minDateTime.date);
      setSelectedTime(minDateTime.time);
    }
  };

  if (!campaign) return null;

  const timePreview = getScheduledTimePreview();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Campaign
          </DialogTitle>
          <DialogDescription>
            Schedule &ldquo;{campaign.name}&rdquo; to be sent at a specific date and time.
            The campaign will be automatically sent to all {campaign.recipients_count} recipients.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="schedule-timezone" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Timezone
            </Label>
            <select
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            {selectedTimezone && (
              <p className="text-xs text-gray-500">
                Current time in {selectedTimezone}: {getCurrentTimeInTimezone()}
              </p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="schedule-date">Date</Label>
            <Input
              id="schedule-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="schedule-time">Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="schedule-time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              Enter time in {selectedTimezone || 'selected timezone'}
            </p>
          </div>
          
          {timePreview && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
              <p className="text-sm text-blue-800">
                <strong>Scheduled for:</strong> {timePreview.userTime}
              </p>
              <p className="text-xs text-blue-600">
                <strong>UTC:</strong> {timePreview.utcTime}
              </p>
              {!isValidDateTime() && (
                <p className="text-sm text-red-600">
                  ⚠️ Please select a date and time at least 5 minutes in the future
                </p>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isScheduling}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSchedule}
            disabled={!isValidDateTime() || isScheduling}
          >
            {isScheduling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Campaign
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
