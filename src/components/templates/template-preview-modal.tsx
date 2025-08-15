"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Code, 
  Smartphone, 
  Monitor, 
  Calendar,
  User,
  Mail
} from "lucide-react";
import { Template } from "@/lib/emailtracker-api";

interface TemplatePreviewModalProps {
  template: Template;
  children: React.ReactNode;
}

export function TemplatePreviewModal({ template, children }: TemplatePreviewModalProps) {
  const [viewMode, setViewMode] = useState<'html' | 'text' | 'mobile'>('html');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderPreview = () => {
    switch (viewMode) {
      case 'html':
        return (
          <div className="border rounded-lg p-4 bg-white">
            {template.html_content ? (
              <iframe
                srcDoc={template.html_content}
                className="w-full h-96 border-0"
                title="HTML Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No HTML content available</p>
                </div>
              </div>
            )}
          </div>
        );
      case 'text':
        return (
          <div className="border rounded-lg p-4 bg-gray-50 font-mono text-sm whitespace-pre-wrap h-96 overflow-y-auto">
            {template.text_content || 'No text content available'}
          </div>
        );
      case 'mobile':
        return (
          <div className="flex justify-center">
            <div className="w-80 border rounded-lg bg-white shadow-lg">
              <div className="bg-gray-100 p-2 rounded-t-lg flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600 ml-2">Mobile Preview</span>
              </div>
              <div className="p-4 h-96 overflow-y-auto">
                {template.html_content ? (
                  <iframe
                    srcDoc={template.html_content}
                    className="w-full h-full border-0"
                    title="Mobile Preview"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Smartphone className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No content available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">{template.name}</DialogTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {template.type}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {template.status}
                </Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'html' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('html')}
              >
                <Monitor className="h-4 w-4 mr-1" />
                Desktop
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('mobile')}
              >
                <Smartphone className="h-4 w-4 mr-1" />
                Mobile
              </Button>
              <Button
                variant={viewMode === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('text')}
              >
                <Code className="h-4 w-4 mr-1" />
                Text
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Subject:</span>
                <span>{template.subject || 'No subject'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Usage Count:</span>
                <span>{template.usage_count} times</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Created:</span>
                <span>{formatDate(template.created_at)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Updated:</span>
                <span>{formatDate(template.updated_at)}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {template.description && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">{template.description}</p>
            </div>
          )}

          {/* Preview */}
          <div className="space-y-2">
            <h3 className="font-medium">Preview</h3>
            {renderPreview()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
