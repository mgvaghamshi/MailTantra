"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Trash2, 
  Download, 
  Mail, 
  AlertTriangle,
  CheckCircle,
  Loader2 
} from "lucide-react";
import emailTrackerAPI, { Contact } from "@/lib/emailtracker-api";

interface BulkActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedContacts: Contact[];
  onActionComplete: () => void;
}

type BulkAction = "delete" | "export" | "email";

export function BulkActionsModal({ 
  isOpen, 
  onClose, 
  selectedContacts, 
  onActionComplete 
}: BulkActionsModalProps) {
  const [selectedAction, setSelectedAction] = useState<BulkAction | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const handleActionSelect = (action: BulkAction) => {
    setSelectedAction(action);
    setResult("");
  };

  const handleConfirm = async () => {
    if (!selectedAction) return;

    setLoading(true);
    try {
      switch (selectedAction) {
        case "delete":
          await emailTrackerAPI.bulkDeleteContacts(selectedContacts.map(c => c.id));
          setResult(`Successfully deleted ${selectedContacts.length} contacts`);
          break;
          
        case "export":
          const blob = await emailTrackerAPI.exportContacts({
            ids: selectedContacts.map(c => c.id)
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `contacts_export_${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
          setResult(`Successfully exported ${selectedContacts.length} contacts`);
          break;
          
        case "email":
          // This would typically open an email composition modal
          // For now, we'll just show a message
          setResult("Email composition feature coming soon!");
          break;
      }
      
      onActionComplete();
    } catch (error) {
      console.error("Bulk action failed:", error);
      setResult("Action failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedAction(null);
    setResult("");
    onClose();
  };

  const getActionDetails = (action: BulkAction) => {
    switch (action) {
      case "delete":
        return {
          title: "Delete Contacts",
          description: `Are you sure you want to delete ${selectedContacts.length} contacts? This action cannot be undone.`,
          icon: <Trash2 className="h-6 w-6 text-red-500" />,
          confirmText: "Delete Contacts",
          confirmVariant: "destructive" as const,
          warning: true
        };
      case "export":
        return {
          title: "Export Contacts",
          description: `Export ${selectedContacts.length} contacts to a CSV file.`,
          icon: <Download className="h-6 w-6 text-blue-500" />,
          confirmText: "Export Contacts",
          confirmVariant: "default" as const,
          warning: false
        };
      case "email":
        return {
          title: "Send Bulk Email",
          description: `Send an email to ${selectedContacts.length} contacts.`,
          icon: <Mail className="h-6 w-6 text-green-500" />,
          confirmText: "Continue to Email Composer",
          confirmVariant: "default" as const,
          warning: false
        };
      default:
        return null;
    }
  };

  const actionDetails = selectedAction ? getActionDetails(selectedAction) : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {selectedAction ? actionDetails?.title : "Bulk Actions"}
          </DialogTitle>
          <DialogDescription>
            {selectedAction 
              ? actionDetails?.description 
              : `Perform actions on ${selectedContacts.length} selected contacts`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedAction && !result && (
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => handleActionSelect("export")}
              >
                <Download className="mr-3 h-5 w-5 text-blue-500" />
                <div className="text-left">
                  <div className="font-medium">Export Contacts</div>
                  <div className="text-sm text-gray-500">Download as CSV file</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => handleActionSelect("email")}
              >
                <Mail className="mr-3 h-5 w-5 text-green-500" />
                <div className="text-left">
                  <div className="font-medium">Send Bulk Email</div>
                  <div className="text-sm text-gray-500">Compose and send email</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => handleActionSelect("delete")}
              >
                <Trash2 className="mr-3 h-5 w-5 text-red-500" />
                <div className="text-left">
                  <div className="font-medium">Delete Contacts</div>
                  <div className="text-sm text-gray-500">Permanently remove contacts</div>
                </div>
              </Button>
            </div>
          )}

          {selectedAction && !result && actionDetails && (
            <div className="space-y-4">
              {actionDetails.warning && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    This action cannot be undone
                  </span>
                </div>
              )}

              <div className="flex items-center justify-center space-x-3 py-4">
                {actionDetails.icon}
                <div className="text-center">
                  <p className="font-medium">{actionDetails.title}</p>
                  <p className="text-sm text-gray-600">
                    {selectedContacts.length} contacts selected
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">Selected Contacts:</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedContacts.slice(0, 5).map((contact) => (
                    <div key={contact.id} className="text-sm text-gray-600">
                      {contact.first_name && contact.last_name 
                        ? `${contact.first_name} ${contact.last_name} (${contact.email})`
                        : contact.email
                      }
                    </div>
                  ))}
                  {selectedContacts.length > 5 && (
                    <div className="text-sm text-gray-500 italic">
                      ...and {selectedContacts.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="text-center py-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Action Complete</h3>
              <p className="text-gray-600">{result}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          {!selectedAction || result ? (
            <Button onClick={handleClose}>
              {result ? "Done" : "Cancel"}
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setSelectedAction(null)}>
                Back
              </Button>
              <Button 
                variant={actionDetails?.confirmVariant}
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  actionDetails?.confirmText
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
