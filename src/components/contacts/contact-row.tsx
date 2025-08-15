"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Mail,
  Calendar,
  UserCheck,
  UserX,
  Edit3,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Contact } from "@/lib/emailtracker-api";

interface ContactRowProps {
  contact: Contact;
  isSelected: boolean;
  onSelectionChange: (contactId: string, selected: boolean) => void;
  onEdit?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "active":
      return "default";
    case "unsubscribed":
      return "secondary";
    case "bounced":
      return "destructive";
    default:
      return "secondary";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "active":
      return <UserCheck className="h-3 w-3" />;
    case "unsubscribed":
      return <UserX className="h-3 w-3" />;
    case "bounced":
      return <Mail className="h-3 w-3" />;
    default:
      return <UserCheck className="h-3 w-3" />;
  }
}

export function ContactRow({ 
  contact, 
  isSelected, 
  onSelectionChange, 
  onEdit, 
  onDelete 
}: ContactRowProps) {
  const handleSelectionChange = (checked: boolean) => {
    onSelectionChange(contact.id, checked);
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => handleSelectionChange(e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          aria-label={`Select ${contact.email}`}
        />
        
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-sm font-medium text-blue-600">
            {contact.first_name?.[0] || contact.email[0].toUpperCase()}
            {contact.last_name?.[0] || ""}
          </span>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900">
            {contact.first_name && contact.last_name 
              ? `${contact.first_name} ${contact.last_name}`
              : contact.email
            }
          </h3>
          <p className="text-sm text-gray-500">{contact.email}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant={getStatusBadgeVariant(contact.status)} className="flex items-center space-x-1">
              {getStatusIcon(contact.status)}
              <span className="capitalize">{contact.status}</span>
            </Badge>
            {contact.tags?.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-right text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Joined {new Date(contact.created_at).toLocaleDateString()}</span>
          </div>
          {contact.last_activity && (
            <div className="mt-1">
              Last active {new Date(contact.last_activity).toLocaleDateString()}
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(contact)}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Contact
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => window.open(`mailto:${contact.email}`)}>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {onDelete && (
              <DropdownMenuItem 
                onClick={() => onDelete(contact)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Contact
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
