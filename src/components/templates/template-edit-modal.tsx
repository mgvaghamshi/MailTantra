"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Edit3, 
  Save, 
  Loader2
} from "lucide-react";
import { Template, TemplateUpdate, emailTrackerAPI } from "@/lib/emailtracker-api";

interface TemplateEditModalProps {
  template: Template;
  children: React.ReactNode;
  onUpdate: () => void;
}

export function TemplateEditModal({ template, children, onUpdate }: TemplateEditModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TemplateUpdate>({
    name: template.name,
    subject: template.subject || '',
    description: template.description || '',
    type: template.type,
    status: template.status,
    html_content: template.html_content || '',
    text_content: template.text_content || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailTrackerAPI.updateTemplate(template.id, formData);
      alert('Template updated successfully');
      onUpdate();
      setOpen(false);
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Failed to update template');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof TemplateUpdate, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit3 className="h-5 w-5" />
            <span>Edit Template</span>
            <Badge variant="outline" className="ml-2">
              {template.type}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter template name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                value={formData.subject || ''}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Enter email subject"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe this template..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Template Type</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="marketing">Marketing</option>
                <option value="transactional">Transactional</option>
                <option value="newsletter">Newsletter</option>
                <option value="welcome">Welcome</option>
                <option value="promotional">Promotional</option>
                <option value="notification">Notification</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="html_content">HTML Content</Label>
            <Textarea
              id="html_content"
              value={formData.html_content || ''}
              onChange={(e) => handleInputChange('html_content', e.target.value)}
              placeholder="Enter HTML content..."
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="text_content">Text Content</Label>
            <Textarea
              id="text_content"
              value={formData.text_content || ''}
              onChange={(e) => handleInputChange('text_content', e.target.value)}
              placeholder="Enter plain text content..."
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
