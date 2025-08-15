"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Trash2, 
  Copy, 
  Eye, 
  Send,
  Pause,
  Play,
  Archive,
  Calendar,
  Clock
} from "lucide-react";
import emailTrackerAPI, { Campaign } from "@/lib/emailtracker-api";
import { SendCampaignDialog } from "@/components/send-campaign-dialog";
import { ScheduleCampaignDialog } from "@/components/schedule-campaign-dialog";
import { toast } from "sonner";

interface CampaignActionsProps {
  campaign: Campaign;
  onCampaignUpdated?: () => void;
}

export function CampaignActions({ campaign, onCampaignUpdated }: CampaignActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await emailTrackerAPI.deleteCampaign(campaign.id);
      setDeleteDialogOpen(false);
      onCampaignUpdated?.();
      toast.success(`Campaign "${campaign.name}" deleted successfully`);
    } catch (error) {
      console.error("Failed to delete campaign:", error);
      toast.error("Failed to delete campaign", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      await emailTrackerAPI.createCampaign({
        name: `${campaign.name} (Copy)`,
        subject: campaign.subject,
        description: campaign.description
      });
      onCampaignUpdated?.();
      toast.success(`Campaign "${campaign.name}" duplicated successfully`);
    } catch (error) {
      console.error("Failed to duplicate campaign:", error);
      toast.error("Failed to duplicate campaign", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    }
  };

  const handleCancelSchedule = async () => {
    setCanceling(true);
    try {
      const response = await emailTrackerAPI.cancelScheduledCampaign(campaign.id);
      if (response.success) {
        onCampaignUpdated?.();
        toast.success(`Schedule cancelled for "${campaign.name}"`);
      } else {
        throw new Error(response.error || "Failed to cancel schedule");
      }
    } catch (error) {
      console.error("Failed to cancel scheduled campaign:", error);
      toast.error("Failed to cancel schedule", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    } finally {
      setCanceling(false);
    }
  };

  const canSendOrSchedule = campaign.status === 'draft' || campaign.status === 'paused';
  const isScheduled = campaign.status === 'scheduled';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          
          {canSendOrSchedule && (
            <>
              <DropdownMenuSeparator />
              <SendCampaignDialog campaign={campaign} onCampaignUpdated={onCampaignUpdated}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Now
                </DropdownMenuItem>
              </SendCampaignDialog>
              
              <ScheduleCampaignDialog campaign={campaign} onCampaignUpdated={onCampaignUpdated}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </DropdownMenuItem>
              </ScheduleCampaignDialog>
            </>
          )}
          
          {isScheduled && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCancelSchedule} disabled={canceling}>
                <Clock className="mr-2 h-4 w-4" />
                {canceling ? "Cancelling..." : "Cancel Schedule"}
              </DropdownMenuItem>
            </>
          )}
          
          {campaign.status === 'sending' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Pause className="mr-2 h-4 w-4" />
                Pause Campaign
              </DropdownMenuItem>
            </>
          )}
          
          {campaign.status === 'paused' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Play className="mr-2 h-4 w-4" />
                Resume Campaign
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{campaign.name}&rdquo;? This action cannot be undone.
              All campaign data and statistics will be permanently lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete Campaign"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
