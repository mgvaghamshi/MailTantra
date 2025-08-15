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
  List,
  ChevronRight,
  ChevronDown,
  Home,
  SidebarOpen,
  SidebarClose
} from "lucide-react";
import { useTemplates, useTemplateStats } from "@/hooks/use-emailtracker";
import emailTrackerAPI, { Template, TemplateFolder } from "@/lib/emailtracker-api";
import { TemplatePreviewModal } from "@/components/templates/template-preview-modal";
import { TemplateEditModal } from "@/components/templates/template-edit-modal";
import { TemplateGalleryModal } from "@/components/templates/template-gallery-modal";
import { TemplateBuilderModal } from "@/components/templates/template-builder-modal";
import { toast } from "sonner";

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
  // Core state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [folderFilter, setFolderFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Folder management
  const [folders, setFolders] = useState<TemplateFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<TemplateFolder | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<TemplateFolder | null>(null);
  
  // Template management
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  // Fetch templates and stats
  const { data: templatesData, loading: templatesLoading, error: templatesError, refresh: refreshTemplates } = useTemplates({
    search: searchTerm,
    status: statusFilter || undefined,
    type: typeFilter || undefined,
    folder_id: folderFilter || undefined,
  });

  const { data: statsData, loading: statsLoading } = useTemplateStats();

  const templates = templatesData?.templates || [];
  const stats = statsData || { total: 0, draft: 0, published: 0, archived: 0 };

  // Load folders
  useEffect(() => {
    const loadFolders = async () => {
      try {
        const data = await emailTrackerAPI.getTemplateFolders();
        setFolders(data);
      } catch (error) {
        console.error("Error loading folders:", error);
      }
    };
    loadFolders();
  }, []);

  // Template actions
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
    if (confirm("Are you sure you want to delete this template?")) {
      try {
        await emailTrackerAPI.deleteTemplate(templateId);
        toast.success("Template deleted successfully");
        refreshTemplates();
      } catch (error) {
        console.error("Error deleting template:", error);
        toast.error("Failed to delete template");
      }
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

  // Folder actions
  const handleCreateFolder = async (name: string) => {
    try {
      await emailTrackerAPI.createTemplateFolder({ name, description: "" });
      toast.success("Folder created successfully");
      const data = await emailTrackerAPI.getTemplateFolders();
      setFolders(data);
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
    }
  };

  const handleUpdateFolder = async (id: string, name: string) => {
    try {
      await emailTrackerAPI.updateTemplateFolder(id, { name });
      toast.success("Folder updated successfully");
      const data = await emailTrackerAPI.getTemplateFolders();
      setFolders(data);
    } catch (error) {
      console.error("Error updating folder:", error);
      toast.error("Failed to update folder");
    }
  };

  const handleDeleteFolder = async (id: string) => {
    if (confirm("Are you sure you want to delete this folder? Templates will be moved to the root folder.")) {
      try {
        await emailTrackerAPI.deleteTemplateFolder(id);
        toast.success("Folder deleted successfully");
        if (selectedFolder?.id === id) {
          setSelectedFolder(null);
          setFolderFilter("");
        }
        const data = await emailTrackerAPI.getTemplateFolders();
        setFolders(data);
        refreshTemplates();
      } catch (error) {
        console.error("Error deleting folder:", error);
        toast.error("Failed to delete folder");
      }
    }
  };

  const toggleFolderExpanded = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFolderSelect = (folder: TemplateFolder | null) => {
    setSelectedFolder(folder);
    setFolderFilter(folder?.id || "");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredTemplates = templates.filter(template => {
    return (
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  if (templatesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-80'
      } flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <h2 className="font-semibold text-gray-900">Folders</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <SidebarOpen className="h-4 w-4" /> : <SidebarClose className="h-4 w-4" />}
          </Button>
        </div>

        {/* Folder Tree */}
        {!sidebarCollapsed && (
          <div className="flex-1 overflow-y-auto p-4">
            {/* Root Folder */}
            <div
              className={`flex items-center p-2 rounded-lg cursor-pointer mb-2 ${
                !selectedFolder ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleFolderSelect(null)}
            >
              <Home className="h-4 w-4 mr-2" />
              <span className="font-medium">All Templates</span>
              <span className="ml-auto text-sm text-gray-500">
                {templates.filter(t => !t.folder_id).length}
              </span>
            </div>

            {/* Folders */}
            <div className="space-y-1">
              {folders.map(folder => (
                <div key={folder.id}>
                  <div
                    className={`flex items-center p-2 rounded-lg cursor-pointer ${
                      selectedFolder?.id === folder.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleFolderSelect(folder)}
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    <span className="flex-1">{folder.name}</span>
                    <span className="text-sm text-gray-500 mr-2">
                      {templates.filter(t => t.folder_id === folder.id).length}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingFolder(folder)}>
                          <Edit className="mr-2 h-3 w-3" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteFolder(folder.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-3 w-3" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>

            {/* Create Folder Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => setShowFolderModal(true)}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
              <p className="text-gray-600">
                {selectedFolder ? `${selectedFolder.name} • ` : ''}
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <TemplateGalleryModal onSelectTemplate={refreshTemplates}>
                <Button variant="outline">
                  <Crown className="h-4 w-4 mr-2" />
                  Browse Gallery
                </Button>
              </TemplateGalleryModal>
              
              <DropdownMenu open={showCreateMenu} onOpenChange={setShowCreateMenu}>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Create New Template</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <TemplateBuilderModal onTemplateCreated={refreshTemplates}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Palette className="mr-2 h-4 w-4" />
                      Blank Template
                    </DropdownMenuItem>
                  </TemplateBuilderModal>
                  <DropdownMenuItem onClick={() => {
                    emailTrackerAPI.createTemplate({
                      name: "Welcome Email",
                      type: "welcome",
                      status: "draft",
                      subject: "Welcome!",
                      description: "Welcome email template",
                      folder_id: selectedFolder?.id
                    }).then(() => refreshTemplates());
                    setShowCreateMenu(false);
                  }}>
                    <Mail className="mr-2 h-4 w-4" />
                    Quick Welcome Email
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    emailTrackerAPI.createTemplate({
                      name: "Newsletter",
                      type: "newsletter",
                      status: "draft",
                      subject: "Newsletter",
                      description: "Newsletter template",
                      folder_id: selectedFolder?.id
                    }).then(() => refreshTemplates());
                    setShowCreateMenu(false);
                  }}>
                    <FileText className="mr-2 h-4 w-4" />
                    Quick Newsletter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Type
                  {typeFilter && <Badge variant="secondary" className="ml-2">{typeFilter}</Badge>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTypeFilter("")}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("newsletter")}>
                  Newsletter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("promotional")}>
                  Promotional
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("transactional")}>
                  Transactional
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("welcome")}>
                  Welcome
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Status
                  {statusFilter && <Badge variant="secondary" className="ml-2">{statusFilter}</Badge>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                  Draft
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("published")}>
                  Published
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("archived")}>
                  Archived
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Templates Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search or filters' : 'Get started by creating your first template'}
              </p>
              <TemplateBuilderModal onTemplateCreated={refreshTemplates}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Template
                </Button>
              </TemplateBuilderModal>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
            }>
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="group hover:shadow-md transition-all duration-200">
                  {viewMode === 'grid' ? (
                    /* Grid View */
                    <>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base mb-1 line-clamp-1">{template.name}</CardTitle>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className={getTypeBadgeColor(template.type)}>
                                {template.type}
                              </Badge>
                              <Badge variant={getStatusBadgeVariant(template.status)}>
                                {template.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
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
                                <Home className="mr-2 h-4 w-4" />
                                All Templates
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
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {template.description || 'No description'}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Updated {formatDate(template.updated_at)}</span>
                          <span>{template.usage_count || 0} uses</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-3">
                          <TemplatePreviewModal template={template}>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="mr-1 h-3 w-3" />
                              Preview
                            </Button>
                          </TemplatePreviewModal>
                          <TemplateEditModal template={template} onUpdate={refreshTemplates}>
                            <Button size="sm" className="flex-1" disabled={template.is_locked}>
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                          </TemplateEditModal>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    /* List View */
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded border flex items-center justify-center">
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
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-900">{formatDate(template.updated_at)}</div>
                            <div className="text-xs text-gray-500">{template.usage_count || 0} uses</div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleDuplicateTemplate(template.id)}>
                                  <Copy className="mr-2 h-3 w-3" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Move to Folder</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleMoveTemplate(template.id, null)}>
                                  <Home className="mr-2 h-3 w-3" />
                                  All Templates
                                </DropdownMenuItem>
                                {folders.map(folder => (
                                  <DropdownMenuItem 
                                    key={folder.id}
                                    onClick={() => handleMoveTemplate(template.id, folder.id)}
                                    disabled={template.folder_id === folder.id}
                                  >
                                    <Folder className="mr-2 h-3 w-3" />
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
                                  <Trash2 className="mr-2 h-3 w-3" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Folder Modal */}
      {(showFolderModal || editingFolder) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editingFolder ? 'Rename Folder' : 'Create New Folder'}
            </h3>
            <Input 
              placeholder="Folder name"
              defaultValue={editingFolder?.name || ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const name = e.currentTarget.value.trim();
                  if (name) {
                    if (editingFolder) {
                      handleUpdateFolder(editingFolder.id, name);
                      setEditingFolder(null);
                    } else {
                      handleCreateFolder(name);
                      setShowFolderModal(false);
                    }
                    e.currentTarget.value = '';
                  }
                }
              }}
              autoFocus
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
                const name = input?.value.trim();
                if (name) {
                  if (editingFolder) {
                    handleUpdateFolder(editingFolder.id, name);
                    setEditingFolder(null);
                  } else {
                    handleCreateFolder(name);
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
    </div>
  );
}
