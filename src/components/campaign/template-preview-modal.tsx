"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Eye, 
  Mail, 
  Calendar,
  FileText,
  Check
} from "lucide-react";
import type { Template } from "@/lib/emailtracker-api";

interface TemplatePreviewModalProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (template: Template) => void;
  templates: Template[];
}

export function TemplatePreviewModal({
  template: initialTemplate,
  open,
  onOpenChange,
  onSelect,
  templates,
}: TemplatePreviewModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(initialTemplate);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter templates based on search query
  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Choose Email Template
          </DialogTitle>
          <DialogDescription>
            Select a template for your campaign. You can preview templates before selecting.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 gap-6 overflow-hidden">
          {/* Template List */}
          <div className="w-1/2 flex flex-col">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Template List */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-3">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-primary-300'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-neutral-900 truncate">
                            {template.name}
                          </h4>
                          {selectedTemplate?.id === template.id && (
                            <Check className="h-4 w-4 text-primary-600" />
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs mb-2">
                          {template.type}
                        </Badge>
                      </div>
                    </div>
                    
                    {template.subject && (
                      <p className="text-sm text-neutral-600 mb-2 line-clamp-1">
                        <strong>Subject:</strong> {template.subject}
                      </p>
                    )}
                    
                    {template.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {template.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(template.created_at).toLocaleDateString()}
                      </span>
                      <span>Used {template.usage_count} times</span>
                    </div>
                  </div>
                ))}
                
                {filteredTemplates.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No templates found matching your search.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Template Preview */}
          <div className="w-1/2 flex flex-col border-l pl-6">
            {selectedTemplate ? (
              <>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-5 w-5 text-primary-600" />
                    <h3 className="text-lg font-semibold">{selectedTemplate.name}</h3>
                    <Badge variant="secondary">{selectedTemplate.type}</Badge>
                  </div>
                  
                  {selectedTemplate.subject && (
                    <p className="text-sm text-neutral-600 mb-2">
                      <strong>Subject:</strong> {selectedTemplate.subject}
                    </p>
                  )}
                  
                  {selectedTemplate.description && (
                    <p className="text-sm text-muted-foreground">
                      {selectedTemplate.description}
                    </p>
                  )}
                </div>

                {/* Content Preview */}
                <div className="flex-1 bg-neutral-50 rounded-lg p-4 overflow-hidden">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </h4>
                  
                  <div className="h-full overflow-y-auto">
                    {selectedTemplate.html_content ? (
                      <div 
                        className="prose prose-sm max-w-none bg-white p-4 rounded border"
                        dangerouslySetInnerHTML={{ 
                          __html: selectedTemplate.html_content 
                        }}
                      />
                    ) : selectedTemplate.text_content ? (
                      <div className="bg-white p-4 rounded border font-mono text-sm whitespace-pre-wrap">
                        {selectedTemplate.text_content}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        No content preview available
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a template to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSelect}
            disabled={!selectedTemplate}
          >
            Use This Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
