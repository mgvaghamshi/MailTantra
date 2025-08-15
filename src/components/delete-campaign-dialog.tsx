'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { emailTrackerAPI, Campaign } from '@/lib/emailtracker-api'
import { toast } from 'sonner'
import { useState } from 'react'
import ThemedButton from '@/components/ui/ThemedButton'

interface DeleteCampaignDialogProps {
  campaign: Campaign | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteCampaignDialog({
  campaign,
  open,
  onOpenChange,
  onSuccess
}: DeleteCampaignDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!campaign) return

    try {
      setIsDeleting(true)
      await emailTrackerAPI.deleteCampaign(campaign.id)
      
      toast.success(`Campaign "${campaign.name}" deleted successfully`)
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error deleting campaign:', error)
      toast.error('Failed to delete campaign. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!campaign) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-error-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-error-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-neutral-900">
            Delete Campaign
          </DialogTitle>
          <DialogDescription className="text-neutral-600">
            Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-error-50 border border-error-200 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-error-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-medium text-error-900">This will permanently delete:</h4>
              <ul className="text-sm text-error-700 space-y-1">
                <li>• Campaign content and settings</li>
                <li>• Email templates and subject lines</li>
                <li>• Recipient lists and segments</li>
                <li>• Analytics and performance data</li>
                <li>• Scheduled send times</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 mt-6">
          <ThemedButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            Cancel
          </ThemedButton>
          <ThemedButton
            variant="destructive"
            onClick={handleDelete}
            loading={isDeleting}
            leftIcon={!isDeleting ? <Trash2 className="w-4 h-4" /> : undefined}
            className="w-full sm:w-auto"
          >
            {isDeleting ? 'Deleting...' : 'Delete Campaign'}
          </ThemedButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
