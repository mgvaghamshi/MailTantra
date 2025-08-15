"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Eye, 
  X, 
  Search, 
  Loader2,
  Mail,
  Calendar
} from "lucide-react";
import { TemplatePreviewModal } from "./template-preview-modal";
import { useTemplates } from "@/hooks/use-emailtracker";
import { demoTemplates, shouldUseDemoTemplates } from "@/lib/demo-templates";
import type { Template } from "@/lib/emailtracker-api";

interface TemplateSelectorProps {
  selectedTemplate: Template | null;
  onTemplateSelect: (template: Template) => void;
  onTemplateRemove: () => void;
}

export function TemplateSelector({
  selectedTemplate,
  onTemplateSelect,
  onTemplateRemove,
}: TemplateSelectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const { data: templates, loading, error } = useTemplates({
    // Remove status filter to get all templates for now
    limit: 20,
  });

  // Use demo templates if no real templates are available
  const actualTemplates = shouldUseDemoTemplates(templates?.templates) ? demoTemplates : templates?.templates || [];
  const totalTemplates = shouldUseDemoTemplates(templates?.templates) ? demoTemplates.length : templates?.total || 0;
  const usingDemoTemplates = shouldUseDemoTemplates(templates?.templates);

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
    setShowModal(true);
  };

  const handleSelectFromModal = (template: Template) => {
    onTemplateSelect(template);
    setShowModal(false);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load templates. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selected Template Display */}
      {selectedTemplate ? (
        <div className="border rounded-lg p-4 bg-primary-50 border-primary-200">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-primary-600" />
                <h4 className="font-medium text-primary-900 truncate">
                  {selectedTemplate.name}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {selectedTemplate.type}
                </Badge>
              </div>
              
              {selectedTemplate.subject && (
                <p className="text-sm text-primary-700 mb-2">
                  <strong>Subject:</strong> {selectedTemplate.subject}
                </p>
              )}
              
              {selectedTemplate.description && (
                <p className="text-sm text-primary-600 mb-3">
                  {selectedTemplate.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-primary-600">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created {new Date(selectedTemplate.created_at).toLocaleDateString()}
                </span>
                <span>Used {selectedTemplate.usage_count} times</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePreview(selectedTemplate)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onTemplateRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Template Selection Interface */
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="text-muted-foreground">Loading templates...</span>
            </div>
          ) : !actualTemplates?.length ? (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                No published templates available. You can create a campaign without a template and add content later.
                <div className="mt-4">
                  <Button variant="outline" onClick={() => setShowModal(true)}>
                    Browse Template Gallery
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Demo Templates Notice */}
              {usingDemoTemplates && (
                <Alert className="mb-4">
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Demo Templates:</strong> These are sample templates for demonstration. 
                    Connect to your template library to access your real templates.
                  </AlertDescription>
                </Alert>
              )}

              {/* Quick Template Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actualTemplates.slice(0, 4).map((template) => (
                  <div
                    key={template.id}
                    className="border rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
                    onClick={() => onTemplateSelect(template)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-neutral-900 truncate mb-1">
                          {template.name}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {template.type}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(template);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {template.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                      <span>Used {template.usage_count} times</span>
                      <span>{new Date(template.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Browse All Templates Button */}
              {totalTemplates > 4 && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowModal(true)}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Browse All Templates ({totalTemplates})
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Skip Template Option */}
          <div className="text-center">
            <Button variant="link" className="text-muted-foreground">
              Skip - I'll add content later
            </Button>
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        open={showModal}
        onOpenChange={setShowModal}
        onSelect={handleSelectFromModal}
        templates={actualTemplates || []}
      />
    </div>
  );
}
