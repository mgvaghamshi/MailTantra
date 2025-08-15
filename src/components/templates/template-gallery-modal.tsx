"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Eye, 
  Copy, 
  Download,
  Grid,
  List,
  Star,
  Crown,
  Loader2,
  CheckCircle,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { Template, SystemTemplate } from "@/lib/emailtracker-api";
import emailTrackerAPI from "@/lib/emailtracker-api";
import { toast } from 'sonner';

interface TemplateGalleryModalProps {
  children: React.ReactNode;
  onSelectTemplate?: (template: Template) => void;
}

// Template category configuration
const templateCategories = [
  { value: 'all', label: 'All Templates', icon: '📧' },
  { value: 'welcome', label: 'Welcome', icon: '👋' },
  { value: 'newsletter', label: 'Newsletter', icon: '📰' },
  { value: 'promotional', label: 'Promotional', icon: '🚀' },
  { value: 'transactional', label: 'Transactional', icon: '📋' },
];

export function TemplateGalleryModal({ children, onSelectTemplate }: TemplateGalleryModalProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewTemplate, setPreviewTemplate] = useState<SystemTemplate | null>(null);
  
  // State for system templates
  const [systemTemplates, setSystemTemplates] = useState<SystemTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyingTemplateId, setCopyingTemplateId] = useState<string | null>(null);

  // Load system templates when modal opens
  useEffect(() => {
    if (open) {
      loadSystemTemplates();
    }
  }, [open]);

  const loadSystemTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const templates = await emailTrackerAPI.getSystemTemplates();
      setSystemTemplates(templates);
    } catch (error) {
      console.error('Failed to load system templates:', error);
      setError('Failed to load templates. Please try again.');
      toast.error('Failed to load system templates');
    } finally {
      setLoading(false);
    }
  };

  // Filter templates based on search and type
  const filteredTemplates = systemTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (template.tags_array || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || template.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleUseTemplate = async (template: SystemTemplate) => {
    setCopyingTemplateId(template.id);
    try {
      // Call the backend API to copy the system template to user's templates
      const response = await emailTrackerAPI.createTemplateFromSystem(template.id, {
        name: `${template.name} - Copy`,
      });

      if (onSelectTemplate) {
        onSelectTemplate(response);
      }
      
      toast.success(`"${template.name}" has been added to your templates`);
      
      setOpen(false);
    } catch (error) {
      console.error('Failed to use template:', error);
      toast.error('Failed to add template. Please try again.');
    } finally {
      setCopyingTemplateId(null);
    }
  };

  const handlePreview = (template: SystemTemplate) => {
    setPreviewTemplate(template);
  };

  const getTypeIcon = (type: string) => {
    const category = templateCategories.find(cat => cat.value === type);
    return category?.icon || '📧';
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'welcome':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'newsletter':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'promotional':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'transactional':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  Template Gallery
                  <Badge className="bg-purple-100 text-purple-800 ml-2">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </DialogTitle>
                <p className="text-gray-600 mt-1">
                  Choose from our collection of professional, responsive email templates
                </p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex flex-col flex-1 min-h-0">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 py-4 border-b bg-gray-50 px-1 rounded-lg">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search templates, tags, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                {templateCategories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedType === category.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType(category.value)}
                    className="flex items-center gap-1"
                  >
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                    {category.value !== 'all' && (
                      <Badge variant="secondary" className="ml-1 h-5 text-xs">
                        {systemTemplates.filter(t => t.type === category.value).length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
              
              <div className="flex border border-gray-300 rounded-md bg-white">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
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

            {/* Templates Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading premium templates...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={loadSystemTemplates} variant="outline">
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📧</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || selectedType !== 'all' 
                      ? "Try adjusting your search or filters" 
                      : "No templates available at the moment"
                    }
                  </p>
                  {(searchTerm || selectedType !== 'all') && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedType('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {/* Results header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {filteredTemplates.length} {filteredTemplates.length === 1 ? 'Template' : 'Templates'}
                      </h3>
                      {selectedType !== 'all' && (
                        <Badge variant="outline" className={getTypeBadgeColor(selectedType)}>
                          {getTypeIcon(selectedType)} {templateCategories.find(cat => cat.value === selectedType)?.label}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Templates Grid/List */}
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTemplates.map((template) => (
                        <div key={template.id} className="group border rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white hover:border-blue-300">
                          {/* Template Preview */}
                          <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center mb-4 group-hover:border-blue-300 transition-colors">
                            {template.thumbnail_url ? (
                              <img 
                                src={template.thumbnail_url} 
                                alt={template.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="text-center">
                                <div className="text-4xl mb-2">{getTypeIcon(template.type)}</div>
                                <span className="text-sm text-gray-500 font-medium">{template.category || 'Template Preview'}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Template Info */}
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {template.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className={getTypeBadgeColor(template.type)}>
                                    {template.type}
                                  </Badge>
                                  {template.is_premium && (
                                    <Badge className="bg-purple-100 text-purple-800">
                                      <Crown className="w-3 h-3 mr-1" />
                                      Premium
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center text-yellow-500">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">{template.rating || 4.5}</span>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 line-clamp-2">
                              {template.description}
                            </p>

                            {/* Tags */}
                            {Array.isArray(template.tags_array) && template.tags_array.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {template.tags_array.slice(0, 3).map((tag: string) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {template.tags_array.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{template.tags_array.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}

                            {/* Usage Stats */}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Copy className="h-3 w-3" />
                                Used {template.usage_count} times
                              </span>
                              <span>{template.industry || 'General'}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePreview(template)}
                                className="flex-1"
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                Preview
                              </Button>
                              <Button 
                                size="sm" 
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleUseTemplate(template)}
                                disabled={copyingTemplateId === template.id}
                              >
                                {copyingTemplateId === template.id ? (
                                  <>
                                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                    Adding...
                                  </>
                                ) : (
                                  <>
                                    <Copy className="mr-1 h-3 w-3" />
                                    Use Template
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* List View */
                    <div className="space-y-4">
                      {filteredTemplates.map((template) => (
                        <div key={template.id} className="border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow bg-white">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="w-20 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded border flex items-center justify-center">
                              <span className="text-2xl">{getTypeIcon(template.type)}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900">{template.name}</h4>
                                <Badge variant="outline" className={getTypeBadgeColor(template.type)}>
                                  {template.type}
                                </Badge>
                                {template.is_premium && (
                                  <Badge className="bg-purple-100 text-purple-800">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Premium
                                  </Badge>
                                )}
                                <div className="flex items-center text-yellow-500 ml-2">
                                  <Star className="h-3 w-3 fill-current" />
                                  <span className="text-xs text-gray-600 ml-1">{template.rating || 4.5}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>Used {template.usage_count} times</span>
                                <span>{template.industry || 'General'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePreview(template)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleUseTemplate(template)}
                              disabled={copyingTemplateId === template.id}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {copyingTemplateId === template.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      {previewTemplate && (
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="flex items-center gap-2">
                    <span className="text-2xl">{getTypeIcon(previewTemplate.type)}</span>
                    {previewTemplate.name}
                    <Badge variant="outline" className={getTypeBadgeColor(previewTemplate.type)}>
                      {previewTemplate.type}
                    </Badge>
                  </DialogTitle>
                  <p className="text-gray-600 mt-1">{previewTemplate.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{previewTemplate.rating || 4.5}</span>
                  </div>
                </div>
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto space-y-6 p-6">
              {/* Template Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Template Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Category:</strong> {previewTemplate.category || 'General'}</div>
                    <div><strong>Industry:</strong> {previewTemplate.industry || 'Any'}</div>
                    <div><strong>Usage:</strong> {previewTemplate.usage_count} times</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {(previewTemplate.tags_array || []).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subject Line */}
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <div className="text-sm bg-gray-50 p-3 rounded border">
                  {previewTemplate.description || 'No description specified'}
                </div>
              </div>
              
              {/* HTML Content Preview */}
              <div>
                <h3 className="font-medium mb-2">Email Preview</h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 text-sm font-medium border-b flex items-center justify-between">
                    <span>HTML Preview</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`data:text/html,${encodeURIComponent(previewTemplate.html_content || '')}`, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open in New Tab
                    </Button>
                  </div>
                  <div 
                    className="bg-white p-4 max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: previewTemplate.html_content || '<p>No content available</p>' }}
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setPreviewTemplate(null)}
                >
                  Close Preview
                </Button>
                <Button
                  onClick={() => {
                    handleUseTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  disabled={copyingTemplateId === previewTemplate.id}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {copyingTemplateId === previewTemplate.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding Template...
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Use This Template
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
