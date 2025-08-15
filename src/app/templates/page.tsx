"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  FileText, 
  Plus, 
  Search, 
  Copy,
  Edit,
  MoreHorizontal,
  Eye,
  Mail,
  Palette,
  Loader2,
  Trash2,
  FolderPlus,
  Folder,
  Lock,
  Grid3X3,
  List
} from "lucide-react";
import { useTemplates } from "@/hooks/use-emailtracker";
import emailTrackerAPI, { Template, TemplateFolder } from "@/lib/emailtracker-api";
import { TemplatePreviewModal } from "@/components/templates/template-preview-modal";
import { TemplateEditModal } from "@/components/templates/template-edit-modal";
import { TemplateGalleryModal } from "@/components/templates/template-gallery-modal";
import { TemplateBuilderModal } from "@/components/templates/template-builder-modal";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "sonner";

function getTypeBadgeColor(type: string) {
  switch (type) {
    case 'newsletter': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'promotional': return 'bg-green-50 text-green-700 border-green-200';
    case 'transactional': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'welcome': return 'bg-orange-50 text-orange-700 border-orange-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'published': return 'default';
    case 'draft': return 'secondary';
    case 'archived': return 'outline';
    default: return 'secondary';
  }
}

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return 'N/A';
  }
}

export default function TemplatesPage() {
  // Basic state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [folderFilter, setFolderFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(null);
  
  // Folder management
  const [folders, setFolders] = useState<TemplateFolder[]>([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

  // Fetch templates
  const { data: templatesData, loading: templatesLoading, error: templatesError, refresh: refreshTemplates } = useTemplates({
    search: searchTerm,
    status: statusFilter,
    type: typeFilter,
    folder_id: folderFilter
  });

  const templates = templatesData?.templates || [];
  const totalTemplates = templatesData?.total || 0;

  // Load folders
  const loadFolders = async () => {
    try {
      const foldersData = await emailTrackerAPI.getTemplateFolders();
      setFolders(foldersData || []);
    } catch (error) {
      console.error("Error loading folders:", error);
      setFolders([]);
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !statusFilter || template.status === statusFilter;
    const matchesType = !typeFilter || template.type === typeFilter;
    const matchesFolder = !folderFilter || template.folder_id === folderFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesFolder;
  });

  // Handle template actions
  const handleDuplicateTemplate = async (templateId: string) => {
    try {
      await emailTrackerAPI.duplicateTemplate(templateId);
      toast.success("Template duplicated successfully");
      refreshTemplates();
    } catch (error) {
      console.error("Error duplicating template:", error);
      if (error instanceof Error && error.message.includes('Network')) {
        toast.error("Network error: Please check if the backend is running on localhost:8001");
      } else {
        toast.error("Failed to duplicate template");
      }
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Template',
      description: 'Are you sure you want to delete this template? This action cannot be undone.',
      onConfirm: async () => {
        setDeletingTemplateId(templateId);
        try {
          console.log('Deleting template:', templateId);
          const response = await emailTrackerAPI.deleteTemplate(templateId);
          console.log('Delete response:', response);
          toast.success("Template deleted successfully");
          refreshTemplates();
        } catch (error) {
          console.error("Error deleting template:", error);
          
          // More detailed error handling
          if (error instanceof Error) {
            if (error.message.includes('Network') || error.message.includes('fetch')) {
              toast.error("Network error: Please check if the backend is running on localhost:8001");
            } else if (error.message.includes('404')) {
              toast.error("Template not found. It may have been already deleted.");
            } else if (error.message.includes('403')) {
              toast.error("Permission denied. You may not have access to delete this template.");
            } else if (error.message.includes('400')) {
              // Parse the error message for more specific information
              if (error.message.includes('campaign')) {
                toast.error("Cannot delete template. It's being used by one or more campaigns. Please delete those campaigns first.");
              } else {
                toast.error("Cannot delete template: " + error.message);
              }
            } else if (error.message.includes('500')) {
              toast.error("Server error while deleting template. Please try again or contact support.");
            } else {
              toast.error(`Failed to delete template: ${error.message}`);
            }
          } else if (typeof error === 'object' && error !== null && 'message' in error) {
            toast.error(`Failed to delete template: ${(error as any).message}`);
          } else {
            toast.error("Failed to delete template. Please try again.");
          }
        } finally {
          setDeletingTemplateId(null);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleMoveTemplate = async (templateId: string, folderId: string | null) => {
    try {
      await emailTrackerAPI.updateTemplate(templateId, { folder_id: folderId || undefined });
      toast.success("Template moved successfully");
      refreshTemplates();
    } catch (error) {
      console.error("Error moving template:", error);
      toast.error("Failed to move template");
    }
  };

  // Handle folder actions
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      await emailTrackerAPI.createTemplateFolder({ name: newFolderName });
      toast.success("Folder created successfully");
      setNewFolderName("");
      setShowFolderModal(false);
      loadFolders();
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Folder',
      description: 'Are you sure you want to delete this folder? Templates will be moved to the root folder.',
      onConfirm: async () => {
        try {
          await emailTrackerAPI.deleteTemplateFolder(folderId);
          toast.success("Folder deleted successfully");
          loadFolders();
          refreshTemplates();
          if (folderFilter === folderId) {
            setFolderFilter("");
          }
        } catch (error) {
          console.error("Error deleting folder:", error);
          toast.error("Failed to delete folder");
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Clean Header */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600">Create and manage professional email templates for your campaigns</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="border rounded-lg p-1 flex bg-gray-50">
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600 hover:text-blue-700 hover:bg-white' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-white shadow-sm text-blue-600 hover:text-blue-700 hover:bg-white' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Browse Gallery */}
            <TemplateGalleryModal 
              onSelectTemplate={(template: Template) => {
                // Handle template selection from gallery
                refreshTemplates();
              }}
            >
              <Button 
                variant="outline"
                size="sm"
              >
                <Palette className="mr-2 h-4 w-4" />
                Browse Gallery
              </Button>
            </TemplateGalleryModal>
            
            {/* New Template */}
            <TemplateBuilderModal 
              onTemplateCreated={refreshTemplates}
              defaultFolderId={folderFilter || undefined}
            >
              <Button 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Template
              </Button>
            </TemplateBuilderModal>
          </div>
        </div>
      </div>

      {/* Folders & Filters */}
      <div className="bg-white rounded-lg border">
        {/* Folder Management Section */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Folders</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFolderModal(true)}
            >
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
          </div>
          
          {/* Folder List */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={folderFilter === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setFolderFilter("")}
              className="flex items-center gap-2"
            >
              <Folder className="h-4 w-4" />
              All Templates
              <Badge variant="secondary" className="ml-1">
                {totalTemplates}
              </Badge>
            </Button>
            
            {folders.map(folder => {
              const folderTemplateCount = templates.filter(t => t.folder_id === folder.id).length;
              return (
                <div key={folder.id} className="flex items-center gap-1">
                  <Button
                    variant={folderFilter === folder.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFolderFilter(folder.id)}
                    className="flex items-center gap-2"
                  >
                    <Folder className="h-4 w-4" />
                    {folder.name}
                    <Badge variant="secondary" className="ml-1">
                      {folderTemplateCount}
                    </Badge>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteFolder(folder.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Folder
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
            
            {folders.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                No folders created yet. Create your first folder to organize templates.
              </p>
            )}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border rounded-md bg-white"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              
              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 text-sm border rounded-md bg-white"
              >
                <option value="">All Types</option>
                <option value="newsletter">Newsletter</option>
                <option value="promotional">Promotional</option>
                <option value="transactional">Transactional</option>
                <option value="welcome">Welcome</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || statusFilter || typeFilter || folderFilter) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setTypeFilter("");
                  setFolderFilter("");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Template Status & Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-600">
            Showing <strong>{filteredTemplates.length}</strong> of <strong>{totalTemplates}</strong> templates
          </p>
          {folderFilter && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Folder className="h-3 w-3" />
                {folders.find(f => f.id === folderFilter)?.name}
              </Badge>
            </div>
          )}
          {(searchTerm || statusFilter || typeFilter) && (
            <Badge variant="secondary" className="text-xs">
              Filtered
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Folder className="h-4 w-4" />
            {folders.length} folders
          </span>
          <span>•</span>
          <span>{totalTemplates} total templates</span>
        </div>
      </div>

      {/* Templates Display */}
      {templatesLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading templates...</span>
        </div>
      ) : templatesError ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading templates: {String(templatesError)}</p>
          <Button onClick={refreshTemplates} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-6">
            {folderFilter ? (
              <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            ) : (
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            )}
          </div>
          
          {folderFilter ? (
            /* Empty Folder State */
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No templates in "{folders.find(f => f.id === folderFilter)?.name}"
              </h3>
              <p className="text-gray-600 mb-6">
                This folder is empty. Create a new template or move existing templates here.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <TemplateBuilderModal 
                  onTemplateCreated={refreshTemplates}
                  defaultFolderId={folderFilter}
                >
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Template in Folder
                  </Button>
                </TemplateBuilderModal>
                <Button 
                  variant="outline" 
                  onClick={() => setFolderFilter("")}
                >
                  View All Templates
                </Button>
              </div>
            </div>
          ) : searchTerm || statusFilter || typeFilter ? (
            /* No Search Results */
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates match your filters</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setTypeFilter("");
                  }}
                >
                  Clear Filters
                </Button>
                <TemplateBuilderModal onTemplateCreated={refreshTemplates}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Template
                  </Button>
                </TemplateBuilderModal>
              </div>
            </div>
          ) : (
            /* No Templates at All */
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first template or browsing our gallery
              </p>
              <div className="flex items-center justify-center space-x-4">
                <TemplateBuilderModal onTemplateCreated={refreshTemplates}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Template
                  </Button>
                </TemplateBuilderModal>
                <TemplateGalleryModal 
                  onSelectTemplate={(template: Template) => {
                    refreshTemplates();
                  }}
                >
                  <Button variant="outline">
                    <Palette className="mr-2 h-4 w-4" />
                    Browse Gallery
                  </Button>
                </TemplateGalleryModal>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : 
          "space-y-3"
        }>
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-all duration-200">
              {viewMode === 'grid' ? (
                /* Grid View */
                <>
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 border-b flex items-center justify-center relative">
                    {template.thumbnail_url ? (
                      <img 
                        src={template.thumbnail_url} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-500">Preview</span>
                      </div>
                    )}
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                      <TemplatePreviewModal template={template}>
                        <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TemplatePreviewModal>
                      <TemplateEditModal template={template} onUpdate={refreshTemplates}>
                        <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white" disabled={template.is_locked}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TemplateEditModal>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate mb-2">{template.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={`${getTypeBadgeColor(template.type)} text-xs`}>
                            {template.type}
                          </Badge>
                          <Badge variant={getStatusBadgeVariant(template.status)} className="text-xs">
                            {template.status}
                          </Badge>
                          {template.is_locked && <Lock className="h-3 w-3 text-orange-500" />}
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <TemplatePreviewModal template={template}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                          </TemplatePreviewModal>
                          <TemplateEditModal template={template} onUpdate={refreshTemplates}>
                            <DropdownMenuItem disabled={template.is_locked} onSelect={(e) => e.preventDefault()}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </TemplateEditModal>
                          <DropdownMenuItem onClick={() => handleDuplicateTemplate(template.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Move to Folder</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleMoveTemplate(template.id, null)}>
                            <Folder className="mr-2 h-4 w-4" />
                            Root Folder
                          </DropdownMenuItem>
                          {folders.map(folder => (
                            <DropdownMenuItem 
                              key={folder.id}
                              onClick={() => handleMoveTemplate(template.id, folder.id)}
                              disabled={template.folder_id === folder.id}
                            >
                              <Folder className="mr-2 h-4 w-4" />
                              {folder.name}
                              {template.folder_id === folder.id && (
                                <span className="ml-auto text-green-600">✓</span>
                              )}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteTemplate(template.id)}
                            disabled={deletingTemplateId === template.id}
                          >
                            {deletingTemplateId === template.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.description || 'No description provided'}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Updated {formatDate(template.updated_at)}</span>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{template.usage_count || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                /* List View */
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                        {template.thumbnail_url ? (
                          <img 
                            src={template.thumbnail_url} 
                            alt={template.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <FileText className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 truncate">
                          {template.description || 'No description'}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={`${getTypeBadgeColor(template.type)} text-xs`}>
                            {template.type}
                          </Badge>
                          <Badge variant={getStatusBadgeVariant(template.status)} className="text-xs">
                            {template.status}
                          </Badge>
                          {template.is_locked && <Lock className="h-3 w-3 text-orange-500" />}
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-gray-500">
                        <div>{formatDate(template.updated_at)}</div>
                        <div className="flex items-center justify-end space-x-1 mt-1">
                          <Eye className="h-3 w-3" />
                          <span>{template.usage_count || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <TemplatePreviewModal template={template}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TemplatePreviewModal>
                      <TemplateEditModal template={template} onUpdate={refreshTemplates}>
                        <Button size="sm" disabled={template.is_locked}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TemplateEditModal>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDuplicateTemplate(template.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteTemplate(template.id)}
                            disabled={deletingTemplateId === template.id}
                          >
                            {deletingTemplateId === template.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* New Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FolderPlus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create New Folder</h3>
                <p className="text-sm text-gray-600">Organize your templates into folders</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder Name
                </label>
                <Input
                  placeholder="Enter folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                  className="w-full"
                  autoFocus
                />
              </div>
              
              {folders.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Existing Folders ({folders.length})
                  </label>
                  <div className="max-h-24 overflow-y-auto border rounded-md p-2 bg-gray-50">
                    <div className="flex flex-wrap gap-1">
                      {folders.map(folder => (
                        <Badge key={folder.id} variant="outline" className="text-xs">
                          <Folder className="h-3 w-3 mr-1" />
                          {folder.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => {
                setShowFolderModal(false);
                setNewFolderName("");
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateFolder} 
                disabled={!newFolderName.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                Create Folder
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, isOpen: open }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant="destructive"
        confirmText="Delete"
      />
    </div>
  );
}