"use client";

import { useState } from "react";
import { Check, Users, Search, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContacts } from "@/hooks/use-emailtracker";
import type { Contact } from "@/lib/emailtracker-api";

interface RecipientsSelectorProps {
  selectedContacts: Contact[];
  onContactsChange: (contacts: Contact[]) => void;
  maxContacts?: number;
  placeholder?: string;
}

export function RecipientsSelector({
  selectedContacts,
  onContactsChange,
  maxContacts = 1000,
  placeholder = "Select recipients..."
}: RecipientsSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  // Fetch contacts with search
  const { data: contactsResponse, loading, error } = useContacts({
    search: searchValue,
    status: 'active', // Only show active contacts
    limit: 50 // Limit for performance
  });

  const contacts = contactsResponse?.data || [];

  const handleSelectContact = (contact: Contact) => {
    if (selectedContacts.find(c => c.id === contact.id)) {
      // Remove if already selected
      onContactsChange(selectedContacts.filter(c => c.id !== contact.id));
    } else if (selectedContacts.length < maxContacts) {
      // Add if not at max limit
      onContactsChange([...selectedContacts, contact]);
    }
    setOpen(false);
  };

  const handleRemoveContact = (contactId: string) => {
    onContactsChange(selectedContacts.filter(c => c.id !== contactId));
  };

  const handleSelectAll = () => {
    const availableContacts = contacts.filter(contact => 
      !selectedContacts.find(selected => selected.id === contact.id)
    );
    const newSelections = availableContacts.slice(0, maxContacts - selectedContacts.length);
    onContactsChange([...selectedContacts, ...newSelections]);
    setOpen(false);
  };

  const handleClearAll = () => {
    onContactsChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Contact Selection Dropdown */}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-auto min-h-10 p-3"
          >
            <div className="flex items-center gap-2 flex-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-left">
                {selectedContacts.length > 0
                  ? `${selectedContacts.length} recipient${selectedContacts.length === 1 ? '' : 's'} selected`
                  : placeholder
                }
              </span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[400px] max-h-[300px] overflow-y-auto">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Available Contacts</span>
            {contacts.length > 0 && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={selectedContacts.length >= maxContacts}
                  className="h-6 px-2 text-xs"
                >
                  Select All
                </Button>
                {selectedContacts.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="h-6 px-2 text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {loading && (
            <DropdownMenuItem disabled>
              Loading contacts...
            </DropdownMenuItem>
          )}
          
          {error && (
            <DropdownMenuItem disabled>
              Error: {error}
            </DropdownMenuItem>
          )}

          {!loading && !error && contacts.length === 0 && (
            <DropdownMenuItem disabled>
              No contacts found
            </DropdownMenuItem>
          )}

          {contacts.map((contact) => {
            const isSelected = selectedContacts.find(c => c.id === contact.id);
            return (
              <DropdownMenuItem
                key={contact.id}
                onClick={() => handleSelectContact(contact)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {contact.first_name && contact.last_name
                          ? `${contact.first_name} ${contact.last_name}`
                          : contact.email
                        }
                      </span>
                      {contact.tags && contact.tags.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {contact.tags[0]}
                          {contact.tags.length > 1 && ` +${contact.tags.length - 1}`}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {contact.email}
                    </p>
                  </div>
                </div>
                
                <Check
                  className={cn(
                    "ml-2 h-4 w-4",
                    isSelected ? "opacity-100" : "opacity-0"
                  )}
                />
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Selected Recipients Display */}
      {selectedContacts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Selected Recipients ({selectedContacts.length})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 h-6 px-2 text-xs"
            >
              Clear All
            </Button>
          </div>
          
          <div className="border rounded-lg p-3 bg-muted/10 max-h-[120px] overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {selectedContacts.map((contact) => (
                <Badge
                  key={contact.id}
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-1"
                >
                  <span className="text-xs">
                    {contact.first_name && contact.last_name
                      ? `${contact.first_name} ${contact.last_name}`
                      : contact.email
                    }
                  </span>
                  <button
                    onClick={() => handleRemoveContact(contact.id)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Limit Warning */}
      {selectedContacts.length >= maxContacts && (
        <Alert>
          <AlertDescription>
            You've reached the maximum limit of {maxContacts} recipients for this campaign.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
