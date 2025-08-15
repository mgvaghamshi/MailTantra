"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Filter, 
  Copy,
  Edit,
  MoreHorizontal,
  Eye,
  Mail,
  Calendar,
  Palette,
  Loader2,
  Trash2,
  FolderPlus,
  Folder,
  Tags,
  Lock,
  Unlock,
  GitBranch,
  Star,
  Crown,
  Grid3X3,
  List
} from "lucide-react";
import { useTemplates, useTemplateStats } from "@/hooks/use-emailtracker";
import emailTrackerAPI, { Template, TemplateFolder } from "@/lib/emailtracker-api";
import { TemplatePreviewModal } from "@/components/templates/template-preview-modal";
import { TemplateEditModal } from "@/components/templates/template-edit-modal";
import { TemplateGalleryModal } from "@/components/templates/template-gallery-modal";
import { toast } from "sonner";
import { TemplateBuilderModal } from "@/components/templates/template-builder-modal";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

function getTypeBadgeColor(type: string) {
  switch (type) {
    case "newsletter":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "promotional":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "transactional":
      return "bg-green-100 text-green-800 border-green-200";
    case "welcome":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "published":
      return "default";
    case "draft":
      return "secondary";
    case "archived":
      return "outline";
    default:
      return "secondary";
  }
}

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [folderFilter, setFolderFilter] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  
  // Premium state
  const [folders, setFolders] = useState<TemplateFolder[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<TemplateFolder | null>(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<TemplateFolder | null>(null);
  const [showMoveTemplatesModal, setShowMoveTemplatesModal] = useState(false);
  const [newFolderId, setNewFolderId] = useState<string | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  // Confirmation dialog state
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

  // Fetch templates and stats
  const { data: templatesData, loading: templatesLoading, error: templatesError, refresh: refreshTemplates } = useTemplates({
    search: searchTerm,
    status: statusFilter,
    type: typeFilter,
    folder_id: folderFilter
  });

  const { data: stats, loading: statsLoading } = useTemplateStats();

  const templates = templatesData?.templates || [];

  // Load premium data and check for default templates
  useEffect(() => {
    loadPremiumData();
  }, []);

  const loadPremiumData = async () => {
    try {
      const [foldersData, tagsData] = await Promise.all([
        emailTrackerAPI.getTemplateFolders().catch(() => []), // Return empty array on error
        emailTrackerAPI.getTemplateTags().catch(() => []), // Return empty array on error  
      ]);
      setFolders(foldersData || []);
      setAvailableTags(tagsData || []);
    } catch (error) {
      console.error("Error loading premium data:", error);
      // Set default empty values in case of error
      setFolders([]);
      setAvailableTags([]);
    }
  };

  // Handle template actions
  const handleDuplicateTemplate = async (templateId: string) => {
    try {
      await emailTrackerAPI.duplicateTemplate(templateId);
      toast.success("Template duplicated successfully");
      refreshTemplates();
    } catch (error) {
      console.error("Error duplicating template:", error);
      toast.error("Failed to duplicate template");
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Template',
      description: 'Are you sure you want to delete this template? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await emailTrackerAPI.deleteTemplate(templateId);
          toast.success("Template deleted successfully");
          refreshTemplates();
        } catch (error) {
          console.error("Error deleting template:", error);
          toast.error("Failed to delete template");
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleLockTemplate = async (templateId: string) => {
    try {
      await emailTrackerAPI.lockTemplate(templateId);
      refreshTemplates();
    } catch (error) {
      console.error("Error locking template:", error);
    }
  };

  const handleUnlockTemplate = async (templateId: string) => {
    try {
      await emailTrackerAPI.unlockTemplate(templateId);
      refreshTemplates();
    } catch (error) {
      console.error("Error unlocking template:", error);
    }
  };

  const handleCreateFolder = async (name: string, parentId?: string) => {
    try {
      const newFolder = await emailTrackerAPI.createTemplateFolder({ name, parent_id: parentId });
      await loadPremiumData();
      
      // Check if there are unorganized templates (not in any folder)
      const unorganizedTemplates = templates.filter(t => !t.folder_id && !t.is_system);
      
      if (unorganizedTemplates.length > 0) {
        setNewFolderId(newFolder.id);
        setShowMoveTemplatesModal(true);
      }
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleUpdateFolder = async (id: string, name: string) => {
    try {
      await emailTrackerAPI.updateTemplateFolder(id, { name });
      await loadPremiumData();
    } catch (error) {
      console.error("Error updating folder:", error);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Folder',
      description: 'Are you sure you want to delete this folder? Templates will be moved to the root folder.',
      onConfirm: async () => {
        try {
          await emailTrackerAPI.deleteTemplateFolder(id);
          await loadPremiumData();
          await refreshTemplates();
          // Clear folder filter if we deleted the currently selected folder
          if (folderFilter === id) {
            setFolderFilter("");
          }
        } catch (error) {
          console.error("Error deleting folder:", error);
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleMoveTemplatesToNewFolder = async (templateIds: string[]) => {
    if (!newFolderId) return;
    
    try {
      // Move selected templates to the new folder
      await Promise.all(
        templateIds.map(templateId => 
          emailTrackerAPI.updateTemplate(templateId, { folder_id: newFolderId })
        )
      );
      
      await refreshTemplates();
      setShowMoveTemplatesModal(false);
      setNewFolderId(null);
      setSelectedTemplates([]);
    } catch (error) {
      console.error("Error moving templates to folder:", error);
    }
  };

  const handleMoveTemplate = async (templateId: string, folderId: string | null) => {
    try {
      await emailTrackerAPI.updateTemplate(templateId, { folder_id: folderId || undefined });
      const folderName = folderId ? folders?.find(f => f.id === folderId)?.name || "Selected Folder" : "Root Folder";
      toast.success(`Template moved to ${folderName}`);
      await refreshTemplates();
    } catch (error) {
      console.error("Error moving template:", error);
      toast.error("Failed to move template");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filter templates based on tags (folder filtering is now done on backend)
  const filteredTemplates = templates.filter(template => {
    if (tagFilter && (!template.tags_array || !template.tags_array.includes(tagFilter))) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600">Create, manage, and organize your email templates</p>
          {folderFilter && (
            <div className="mt-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Folder className="mr-1 h-3 w-3" />
                New templates will be created in: {folders.find(f => f.id === folderFilter)?.name || 'Selected Folder'}
              </Badge>
            </div>
          )}
        </div>
        <div className="flex space-x-4">
          <TemplateBuilderModal 
            onTemplateCreated={refreshTemplates}
            defaultFolderId={folderFilter || undefined}
          >
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </TemplateBuilderModal>
        </div>
      </div>

      {/* Premium Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats?.total_templates || 0
              )}
            </div>
            <p className="text-xs text-gray-500">All templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats?.published_templates || 0
              )}
            </div>
            <p className="text-xs text-gray-500">Ready to use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats?.draft_templates || 0
              )}
            </div>
            <p className="text-xs text-gray-500">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Folders</CardTitle>
            <Folder className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{folders.length}</div>
            <p className="text-xs text-gray-500">Organization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            <Mail className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats?.most_used_template?.usage_count || 0
              )}
            </div>
            <p className="text-xs text-gray-500">
              {stats?.most_used_template?.name || "No usage yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters and Search */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="newsletter">Newsletter</option>
              <option value="promotional">Promotional</option>
              <option value="transactional">Transactional</option>
              <option value="welcome">Welcome</option>
            </select>

            <select
              value={folderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Folders</option>
              {Array.isArray(folders) && folders.map(folder => (
                <option key={folder.id} value={folder.id}>{folder.name}</option>
              ))}
            </select>

            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Tags</option>
              {availableTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Folder Breadcrumb */}
        {selectedFolder && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSelectedFolder(null);
                setFolderFilter("");
              }}
            >
              All Templates
            </Button>
            <span>/</span>
            <span className="font-medium">{selectedFolder?.name}</span>
          </div>
        )}
      </div>

      {/* Templates Display */}
      {templatesLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading templates...</span>
        </div>
      ) : templatesError ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading templates: {templatesError}</p>
          <Button onClick={refreshTemplates} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter || typeFilter || folderFilter || tagFilter
              ? "No templates match your filters"
              : "No templates found"
            }
          </p>
          <div className="flex justify-center space-x-3">
            <TemplateBuilderModal onTemplateCreated={refreshTemplates}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Template
              </Button>
            </TemplateBuilderModal>
            <Button 
              variant="outline" 
              onClick={handleSetupDefaults}
              disabled={setting}
            >
              {setting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Get Default Templates
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setShowGalleryModal(true)}>
              <Crown className="mr-2 h-4 w-4" />
              Browse Template Gallery
            </Button>
          </div>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : 
          "space-y-3"
        }>
          {filteredTemplates.map((template) => (
            <Card key={template.id} className={`hover:shadow-lg transition-shadow duration-200 ${
              viewMode === 'list' ? 'p-4' : ''
            }`}>
              {viewMode === 'grid' ? (
                /* Grid View */
                <>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusBadgeVariant(template.status)}>
                          {template.status}
                        </Badge>
                        {template.is_locked && (
                          <Lock className="h-4 w-4 text-orange-500" />
                        )}
                        {template.version_number && template.version_number > 1 && (
                          <Badge variant="outline" className="text-xs">
                            v{template.version_number}
                          </Badge>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <TemplatePreviewModal template={template}>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                          </TemplatePreviewModal>
                          <TemplateEditModal template={template} onUpdate={refreshTemplates}>
                            <DropdownMenuItem disabled={template.is_locked}>
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
                          <DropdownMenuItem 
                            onClick={() => handleMoveTemplate(template.id, null)}
                          >
                            <Folder className="mr-2 h-4 w-4" />
                            Root Folder
                          </DropdownMenuItem>
                          {Array.isArray(folders) && folders.map(folder => (
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
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {/* Template Preview */}
                    <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center mb-4">
                      {template.thumbnail_url ? (
                        <img 
                          src={template.thumbnail_url} 
                          alt={template.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center">
                          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-500">Template Preview</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={getTypeBadgeColor(template.type)}>
                            {template.type}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Used {template.usage_count} times
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {template.description}
                      </p>

                      {Array.isArray(template.tags_array) && template.tags_array.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {template.tags_array.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {template.tags_array.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.tags_array.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex space-x-2 pt-2">
                        <TemplatePreviewModal template={template}>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="mr-1 h-3 w-3" />
                            Preview
                          </Button>
                        </TemplatePreviewModal>
                        <TemplateEditModal template={template} onUpdate={refreshTemplates}>
                          <Button size="sm" className="flex-1">
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                        </TemplateEditModal>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                /* List View */
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded border flex items-center justify-center">
                      <FileText className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className={getTypeBadgeColor(template.type)}>
                          {template.type}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(template.status)}>
                          {template.status}
                        </Badge>
                        {template.is_locked && <Lock className="h-3 w-3 text-orange-500" />}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {formatDate(template.updated_at)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {template.usage_count} uses
                    </span>
                    <TemplatePreviewModal template={template}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </TemplatePreviewModal>
                    <TemplateEditModal template={template} onUpdate={refreshTemplates}>
                      <Button variant="outline" size="sm" disabled={template.is_locked}>
                        <Edit className="h-3 w-3" />
                      </Button>
                    </TemplateEditModal>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Premium Template Management */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Folder className="mr-2 h-4 w-4" />
              Folder Management
            </CardTitle>
            <CardDescription>
              Organize your templates with folders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.isArray(folders) && folders.length > 0 ? (
              folders.slice(0, 5).map(folder => (
                <div key={folder.id} className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 justify-start"
                    onClick={() => {
                      setFolderFilter(folder.id);
                      setSelectedFolder(folder);
                    }}
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    {folder.name}
                    <span className="ml-auto text-xs text-gray-500">
                      {folder.template_count || 0}
                    </span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingFolder(folder)}
                    className="p-1 h-8 w-8"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteFolder(folder.id)}
                    className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No folders created yet</p>
            )}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowFolderModal(true)}
            >
              <FolderPlus className="mr-2 h-4 w-4" />
              Create New Folder
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="mr-2 h-4 w-4" />
              System Templates
            </CardTitle>
            <CardDescription>
              Professional templates ready to use
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-gray-600">
              Professional templates ready to use
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowGalleryModal(true)}
            >
              <Crown className="mr-2 h-4 w-4" />
              Browse Template Gallery
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="text-sm font-medium">Newsletter</div>
                <div className="text-xs text-gray-500">Templates</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <div className="text-sm font-medium">Promotional</div>
                <div className="text-xs text-gray-500">Templates</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Template Builder
            </CardTitle>
            <CardDescription>
              Create custom templates with premium features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <TemplateBuilderModal onTemplateCreated={refreshTemplates}>
              <Button 
                className="w-full" 
                size="lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Start Building Template
              </Button>
            </TemplateBuilderModal>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={() => emailTrackerAPI.createTemplate({
                  name: "Welcome Email Template",
                  type: "welcome",
                  status: "draft",
                  subject: "Welcome to our platform!",
                  description: "Welcome email for new users",
                  folder_id: selectedFolder?.id
                }).then(() => refreshTemplates())}
              >
                <Mail className="mr-2 h-3 w-3" />
                Welcome Email
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={() => emailTrackerAPI.createTemplate({
                  name: "Newsletter Template",
                  type: "newsletter", 
                  status: "draft",
                  subject: "Monthly Newsletter",
                  description: "Monthly newsletter template",
                  folder_id: selectedFolder?.id
                }).then(() => refreshTemplates())}
              >
                <FileText className="mr-2 h-3 w-3" />
                Newsletter
              </Button>
            </div>

            <div className="text-center">
              <TemplateGalleryModal onSelectTemplate={refreshTemplates}>
                <Button variant="outline" size="sm" className="w-full">
                  <Palette className="mr-2 h-4 w-4" />
                  Browse Template Gallery
                </Button>
              </TemplateGalleryModal>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Move Templates to New Folder Modal */}
      {showMoveTemplatesModal && newFolderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-hidden">
            <h3 className="text-lg font-semibold mb-4">Move Templates to New Folder</h3>
            <p className="text-gray-600 mb-4">
              Select templates to move to the new folder. Unselected templates will remain in the root folder.
            </p>
            
            <div className="max-h-[400px] overflow-y-auto border rounded-lg p-4 mb-4">
              <div className="space-y-2">
                {templates
                  .filter(t => !t.folder_id && !t.is_system)
                  .map(template => (
                    <label 
                      key={template.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTemplates.includes(template.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTemplates(prev => [...prev, template.id]);
                          } else {
                            setSelectedTemplates(prev => prev.filter(id => id !== template.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-500">{template.description || 'No description'}</div>
                      </div>
                      <Badge variant="outline">{template.type}</Badge>
                    </label>
                  ))
                }
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {selectedTemplates.length} template(s) selected
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowMoveTemplatesModal(false);
                    setNewFolderId(null);
                    setSelectedTemplates([]);
                  }}
                >
                  Skip
                </Button>
                <Button 
                  onClick={() => handleMoveTemplatesToNewFolder(selectedTemplates)}
                  disabled={selectedTemplates.length === 0}
                >
                  Move {selectedTemplates.length} Template(s)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Folder Modal */}
      {(showFolderModal || editingFolder) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editingFolder ? 'Edit Folder' : 'Create New Folder'}
            </h3>
            <Input 
              placeholder="Folder name"
              defaultValue={editingFolder?.name || ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const name = e.currentTarget.value;
                  if (name.trim()) {
                    if (editingFolder) {
                      handleUpdateFolder(editingFolder.id, name.trim());
                      setEditingFolder(null);
                    } else {
                      handleCreateFolder(name.trim());
                      setShowFolderModal(false);
                    }
                    e.currentTarget.value = '';
                  }
                }
              }}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowFolderModal(false);
                  setEditingFolder(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={() => {
                const input = document.querySelector('input[placeholder="Folder name"]') as HTMLInputElement;
                if (input?.value.trim()) {
                  if (editingFolder) {
                    handleUpdateFolder(editingFolder.id, input.value.trim());
                    setEditingFolder(null);
                  } else {
                    handleCreateFolder(input.value.trim());
                    setShowFolderModal(false);
                  }
                }
              }}>
                {editingFolder ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Default Templates Setup Modal */}
      {showDefaultSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96 max-w-md">
            <div className="text-center">
              <div className="mb-4">
                <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Setup Default Templates</h3>
                <p className="text-gray-600 mb-6">
                  We'll create default email templates that will be available to all users as system templates. 
                  These professional templates will appear in your System Templates section and can be used as starting points for your campaigns.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-blue-900 mb-2">System templates we'll create:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Welcome Email - Default (System Template)</li>
                  <li>• Monthly Newsletter - Default (System Template)</li>
                </ul>
                <p className="text-xs text-blue-700 mt-2">
                  These will appear in the System Templates section and be available to all users.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDefaultSetup(false)}
                  className="flex-1"
                  disabled={setting}
                >
                  Skip for Now
                </Button>
                <Button 
                  onClick={handleSetupDefaults}
                  className="flex-1"
                  disabled={setting}
                >
                  {setting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Templates
                    </>
                  )}
                </Button>
              </div>
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
