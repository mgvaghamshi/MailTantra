"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DropdownPortal } from "@/components/ui/dropdown-portal";
import { 
  MoreVertical,
  Split,
  Eye,
  Activity,
  FileText,
  Copy,
  History,
  Crown,
  Save,
  Trash2
} from "lucide-react";
import { Campaign } from "@/lib/emailtracker-api";
import { useUserPermissions } from "@/hooks/use-user-permissions";

// Import our dialog components
import { ABTestDialog } from "./ab-test-dialog";
import { EmailPreviewDialog } from "./email-preview-dialog";
import { CampaignLogsDialog } from "./campaign-logs-dialog";
import { DeleteCampaignDialog } from "./delete-campaign-dialog";
import { VersionHistoryDialog } from "./version-history-dialog";

interface CampaignActionsMenuProps {
  campaign: Campaign;
  onCampaignUpdate?: () => void;
  className?: string;
}

interface DialogState {
  abTest: boolean;
  preview: boolean;
  logs: boolean;
  cloning: boolean;
  versioning: boolean;
  delete: boolean;
}

interface MenuItemProps {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  dangerous?: boolean;
}

export function CampaignActionsMenu({ 
  campaign, 
  onCampaignUpdate,
  className = ""
}: CampaignActionsMenuProps) {
  const { hasAccess } = useUserPermissions();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dialogs, setDialogs] = useState<DialogState>({
    abTest: false,
    preview: false,
    logs: false,
    cloning: false,
    versioning: false,
    delete: false
  });

  const openDialog = (dialog: keyof DialogState) => {
    setDialogs(prev => ({ ...prev, [dialog]: true }));
    setIsMenuOpen(false);
  };

  const closeDialog = (dialog: keyof DialogState) => {
    setDialogs(prev => ({ ...prev, [dialog]: false }));
  };

  const menuItems = [
    {
      key: 'abTest' as const,
      label: 'A/B Testing',
      icon: Split,
      feature: 'abTesting' as const,
      description: 'Create and manage A/B tests',
      dangerous: false
    },
    {
      key: 'logs' as const,
      label: 'Delivery Logs',
      icon: Activity,
      feature: 'deliveryLogs' as const,
      description: 'View delivery analytics',
      dangerous: false
    },
    {
      key: 'cloning' as const,
      label: 'Clone Campaign',
      icon: Copy,
      feature: 'autoSave' as const, // Using existing feature for demo
      description: 'Create campaign copy',
      dangerous: false
    },
    {
      key: 'versioning' as const,
      label: 'Version History',
      icon: History,
      feature: 'autoSave' as const, // Using existing feature for demo
      description: 'View and restore versions',
      dangerous: false
    }
  ];

  // Delete is always available - not a premium feature
  const deleteItem = {
    key: 'delete' as const,
    label: 'Delete Campaign',
    icon: Trash2,
    description: 'Permanently delete this campaign',
    dangerous: true
  };

  const availableItems = menuItems.filter(item => hasAccess(item.feature));
  const premiumItems = menuItems.filter(item => !hasAccess(item.feature));
  
  // Always include delete as an available item
  const allAvailableItems = [...availableItems, deleteItem];

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* More actions dropdown */}
        <div className="relative dropdown-container">
          <Button
            ref={buttonRef}
            variant="outline"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 font-medium hover:bg-neutral-50 border-neutral-200 text-neutral-700"
          >
            <MoreVertical className="h-4 w-4" />
            More
          </Button>

          <DropdownPortal
            isOpen={isMenuOpen}
            triggerRef={buttonRef}
            onClose={() => setIsMenuOpen(false)}
          >
            <div className="p-3">
              {/* Available features */}
              {allAvailableItems.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-neutral-500 px-3 py-1">
                    Available Features
                  </div>
                  {allAvailableItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => openDialog(item.key)}
                      className={`w-full flex items-start gap-3 p-3 text-left hover:bg-neutral-50 rounded-lg transition-colors ${
                        item.dangerous ? 'hover:bg-red-50' : ''
                      }`}
                    >
                      <item.icon className={`h-5 w-5 mt-0.5 ${
                        item.dangerous ? 'text-red-600' : 'text-neutral-600'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${
                          item.dangerous ? 'text-red-900' : 'text-neutral-900'
                        }`}>
                          {item.label}
                        </div>
                        <div className={`text-xs mt-1 ${
                          item.dangerous ? 'text-red-600' : 'text-neutral-600'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Premium features */}
              {premiumItems.length > 0 && (
                <>
                  {allAvailableItems.length > 0 && <div className="border-t border-neutral-200 my-3" />}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-neutral-500 px-3 py-1 flex items-center gap-2">
                      <Crown className="h-4 w-4 text-amber-500" />
                      Premium Features
                    </div>
                    {premiumItems.map((item) => (
                      <div
                        key={item.key}
                        className="w-full flex items-start gap-3 p-3 text-left opacity-60 cursor-not-allowed rounded-lg"
                      >
                        <item.icon className="h-5 w-5 mt-0.5 text-neutral-400" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-neutral-600">
                            {item.label}
                          </div>
                          <div className="text-xs text-neutral-500 mt-1">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Upgrade prompt */}
              {premiumItems.length > 0 && (
                <div className="border-t border-neutral-200 mt-3 pt-3">
                  <Button size="sm" className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </div>
              )}
            </div>
          </DropdownPortal>
        </div>
      </div>

      {/* Dialog Components */}
      <ABTestDialog
        campaign={campaign}
        open={dialogs.abTest}
        onOpenChange={(open) => closeDialog('abTest')}
      />

      <EmailPreviewDialog
        campaign={campaign}
        open={dialogs.preview}
        onOpenChange={(open) => closeDialog('preview')}
      />

      <CampaignLogsDialog
        campaign={campaign}
        open={dialogs.logs}
        onOpenChange={(open) => closeDialog('logs')}
      />

      <DeleteCampaignDialog
        campaign={campaign}
        open={dialogs.delete}
        onOpenChange={(open) => closeDialog('delete')}
        onSuccess={onCampaignUpdate}
      />

      <VersionHistoryDialog
        campaign={campaign}
        open={dialogs.versioning}
        onOpenChange={(open) => closeDialog('versioning')}
        onSuccess={onCampaignUpdate}
      />
    </>
  );
}
