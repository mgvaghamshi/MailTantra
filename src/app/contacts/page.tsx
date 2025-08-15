"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Upload,
  Download,
  MoreHorizontal,
  Mail,
  Calendar,
  UserCheck,
  UserX,
  Loader2,
  AlertCircle,
  CheckSquare,
  Square
} from "lucide-react";
import { useContacts } from "@/hooks/use-emailtracker";
import { Contact } from "@/lib/emailtracker-api";
import { ContactRow } from "@/components/contacts/contact-row";
import { AddContactModal } from "@/components/contacts/add-contact-modal";
import { ImportContactsModal } from "@/components/contacts/import-contacts-modal";
import { BulkActionsModal } from "@/components/contacts/bulk-actions-modal";

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
      return <Users className="h-3 w-3" />;
  }
}

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  
  const { data: contactsData, loading, error, refresh } = useContacts({
    search: searchTerm,
    status: statusFilter,
    page: currentPage,
    limit: 10
  });

  const contacts = contactsData?.data || [];
  const totalContacts = contactsData?.total || 0;
  const currentLimit = contactsData?.limit || 10;
  const totalPages = Math.ceil(totalContacts / currentLimit);

  // Calculate stats from the contacts data
  const activeContacts = contacts.filter(c => c.status === 'active').length;
  const unsubscribedContacts = contacts.filter(c => c.status === 'unsubscribed').length;
  const bouncedContacts = contacts.filter(c => c.status === 'bounced').length;

  // Selection management
  const selectedContactObjects = useMemo(() => {
    return contacts.filter(contact => selectedContacts.has(contact.id));
  }, [contacts, selectedContacts]);

  const isAllSelected = contacts.length > 0 && contacts.every(contact => selectedContacts.has(contact.id));
  const isPartiallySelected = selectedContacts.size > 0 && !isAllSelected;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(contacts.map(contact => contact.id)));
    }
  };

  const handleContactSelection = (contactId: string, selected: boolean) => {
    const newSelected = new Set(selectedContacts);
    if (selected) {
      newSelected.add(contactId);
    } else {
      newSelected.delete(contactId);
    }
    setSelectedContacts(newSelected);
  };

  const handleContactAdded = (contact: Contact) => {
    refresh();
    setSelectedContacts(new Set());
  };

  const handleImportComplete = () => {
    refresh();
    setSelectedContacts(new Set());
  };

  const handleBulkActionComplete = () => {
    refresh();
    setSelectedContacts(new Set());
    setShowBulkModal(false);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load contacts</h3>
            <p className="text-gray-600 mb-4">Unable to connect to the EmailTracker API</p>
            <Button onClick={() => refresh()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600">
            Manage your email subscribers, contact lists, and audience segments
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setShowImportModal(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts.toLocaleString()}</div>
            <p className="text-xs text-gray-500">
              {loading ? "Loading..." : "Connected via API"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContacts.toLocaleString()}</div>
            <p className="text-xs text-gray-500">
              {totalContacts > 0 ? ((activeContacts / totalContacts) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
            <UserX className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unsubscribedContacts.toLocaleString()}</div>
            <p className="text-xs text-gray-500">
              {totalContacts > 0 ? ((unsubscribedContacts / totalContacts) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounced</CardTitle>
            <Mail className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bouncedContacts.toLocaleString()}</div>
            <p className="text-xs text-gray-500">
              {totalContacts > 0 ? ((bouncedContacts / totalContacts) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search contacts by email or name..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="bounced">Bounced</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          {selectedContacts.size > 0 && (
            <>
              <span className="text-sm text-gray-600">
                {selectedContacts.size} selected
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowBulkModal(true)}
              >
                Bulk Actions
              </Button>
            </>
          )}
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contact List</CardTitle>
              <CardDescription>
                Manage individual contacts and their subscription status
              </CardDescription>
            </div>
            {contacts.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  {isAllSelected ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : isPartiallySelected ? (
                    <div className="h-4 w-4 border-2 border-gray-400 rounded bg-gray-200" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                  <span>Select All</span>
                </button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading contacts...</span>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter ? "Try adjusting your search filters" : "Start by adding your first contact"}
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <ContactRow
                  key={contact.id}
                  contact={contact}
                  isSelected={selectedContacts.has(contact.id)}
                  onSelectionChange={handleContactSelection}
                />
              ))}

              {currentPage < totalPages && (
                <div className="mt-6 flex justify-center">
                  <Button variant="outline" onClick={handleLoadMore}>
                    Load More Contacts
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bulk Actions</CardTitle>
            <CardDescription>
              Perform actions on multiple contacts at once
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setShowImportModal(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import from CSV
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              disabled={selectedContacts.size === 0}
              onClick={() => setShowBulkModal(true)}
            >
              <Download className="mr-2 h-4 w-4" />
              Export selected contacts
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              disabled={selectedContacts.size === 0}
            >
              <Mail className="mr-2 h-4 w-4" />
              Send bulk email
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segmentation</CardTitle>
            <CardDescription>
              Create targeted contact segments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Create new segment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Filter className="mr-2 h-4 w-4" />
              Manage existing segments
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleStatusFilter("active")}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Active subscribers only
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AddContactModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onContactAdded={handleContactAdded}
      />

      <ImportContactsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={handleImportComplete}
      />

      <BulkActionsModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        selectedContacts={selectedContactObjects}
        onActionComplete={handleBulkActionComplete}
      />
    </div>
  );
}
