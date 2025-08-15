import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CreditCard, Ban } from 'lucide-react';
import Link from 'next/link';

interface RateLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  usagePercentage: number;
  resetTime?: Date;
  planName?: string;
  isBlocked: boolean;
}

export function RateLimitModal({ 
  isOpen, 
  onClose, 
  usagePercentage, 
  resetTime, 
  planName = "Current Plan",
  isBlocked 
}: RateLimitModalProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatResetTime = (resetTime?: Date): string => {
    if (!resetTime) return "Unknown";
    
    const diff = resetTime.getTime() - currentTime.getTime();
    
    if (diff <= 0) return "Now";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getModalContent = () => {
    if (isBlocked) {
      return {
        title: "Rate Limit Exceeded",
        description: "You've reached your rate limit. Wait for reset or upgrade your plan.",
        icon: <Ban className="h-6 w-6 text-red-500" />,
        badgeVariant: "destructive" as const,
        badgeText: "Blocked"
      };
    } else {
      return {
        title: "Usage Limit Warning",
        description: `You've used ${usagePercentage.toFixed(1)}% of your ${planName} quota. Consider upgrading to avoid service interruption.`,
        icon: <Clock className="h-6 w-6 text-orange-500" />,
        badgeVariant: "secondary" as const,
        badgeText: "Warning"
      };
    }
  };

  const content = getModalContent();

  return (
    <Dialog open={isOpen} onOpenChange={isBlocked ? undefined : onClose}>
      <DialogContent 
        className="sm:max-w-[425px]" 
        aria-describedby="rate-limit-description"
        onPointerDownOutside={isBlocked ? (e) => e.preventDefault() : undefined}
        onEscapeKeyDown={isBlocked ? (e) => e.preventDefault() : undefined}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            {content.icon}
            <div className="flex-1">
              <DialogTitle className="text-left">{content.title}</DialogTitle>
              <Badge variant={content.badgeVariant} className="mt-1">
                {content.badgeText}
              </Badge>
            </div>
          </div>
          <DialogDescription id="rate-limit-description" className="text-left pt-2">
            {content.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            {/* Usage Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Usage</span>
                <span className="font-medium">{usagePercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    usagePercentage >= 100 
                      ? 'bg-red-500' 
                      : usagePercentage >= 90 
                        ? 'bg-orange-500' 
                        : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Reset Time */}
            {resetTime && (
              <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Quota resets in:</span>
                </div>
                <span className="font-medium">{formatResetTime(resetTime)}</span>
              </div>
            )}

            {/* Plan Information */}
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <div className="font-medium text-blue-900 mb-1">Need more capacity?</div>
              <div>Upgrade your plan for higher limits and priority support.</div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isBlocked}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            {isBlocked ? `Wait ${formatResetTime(resetTime)}` : 'Close'}
          </Button>
          <Button asChild className="w-full sm:w-auto order-1 sm:order-2">
            <Link href="/pricing">
              <CreditCard className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
