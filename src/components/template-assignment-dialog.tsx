"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Crown,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit3,
  Loader2
} from "lucide-react";
import { Campaign, TemplateAssignment, emailTrackerAPI } from "@/lib/emailtracker-api";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { toast } from "sonner";

interface TemplateAssignmentDialogProps {
  campaign: Campaign;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignmentUpdate?: () => void;
}

interface TemplateOption {
  id: string;
  name: string;
  description?: string;
  category: string;
  is_premium: boolean;
}

export function TemplateAssignmentDialog({ 
  campaign, 
  open, 
  onOpenChange,
  onAssignmentUpdate 
}: TemplateAssignmentDialogProps) {
  const { hasAccess, getUpgradeMessage } = useUserPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [assignments, setAssignments] = useState<TemplateAssignment[]>(
    campaign.template_assignments || []
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [validationResults, setValidationResults] = useState<{
    valid: boolean;
    errors: string[];
    coverage_percentage: number;
  } | null>(null);

  const canUseFeature = hasAccess('multipleTemplates');

  useEffect(() => {
    if (open && canUseFeature) {
      loadTemplates();
      setAssignments(campaign.template_assignments || []);
    }
  }, [open, campaign.template_assignments, canUseFeature]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      // This would typically fetch from an API endpoint
      // For now, using mock data
      const mockTemplates: TemplateOption[] = [
        {
          id: '1',
          name: 'Welcome Email',
          description: 'Standard welcome template',
          category: 'onboarding',
          is_premium: false
        },
        {
          id: '2',
          name: 'Product Launch',
          description: 'Announcement template',
          category: 'marketing',
          is_premium: false
        },
        {
          id: '3',
          name: 'Premium Newsletter',
          description: 'Rich newsletter template',
          category: 'newsletter',
          is_premium: true
        },
        {
          id: '4',
          name: 'Advanced Analytics',
          description: 'Data-driven template',
          category: 'analytics',
          is_premium: true
        }
      ];
      
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  const addTemplate = () => {
    if (!selectedTemplate) return;

    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return;

    // Check if template is already assigned
    if (assignments.some(a => a.template_id === selectedTemplate)) {
      toast.error('Template is already assigned to this campaign');
      return;
    }

    const newAssignment: TemplateAssignment = {
      id: `temp-${Date.now()}`,
      template_id: selectedTemplate,
      template_name: template.name,
      campaign_id: campaign.id,
      assignment_type: 'primary',
      is_active: true,
      segment_rule: { 
        id: `rule-${Date.now()}`,
        name: 'Default Rule',
        conditions: [],
        logic: 'AND'
      }, // Default empty rule
      priority: assignments.length + 1
    };

    setAssignments(prev => [...prev, newAssignment]);
    setSelectedTemplate('');
  };

  const removeTemplate = (assignmentId: string) => {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
  };

  const validateAssignments = async () => {
    if (assignments.length === 0) return;

    try {
      const results = await emailTrackerAPI.validateTemplateAssignments(campaign.id);
      setValidationResults(results);
    } catch (error) {
      console.error('Failed to validate templates:', error);
      toast.error('Failed to validate template assignments');
    }
  };

  const saveAssignments = async () => {
    setIsSaving(true);
    try {
      await emailTrackerAPI.assignTemplates(campaign.id, assignments);
      toast.success('Template assignments saved successfully');
      onAssignmentUpdate?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save template assignments:', error);
      toast.error('Failed to save template assignments', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAssignmentType = (assignmentId: string) => {
    setAssignments(prev =>
      prev.map(a =>
        a.id === assignmentId
          ? {
              ...a,
              assignment_type: a.assignment_type === 'primary' ? 'fallback' : 'primary'
            }
          : a
      )
    );
  };

  const toggleActive = (assignmentId: string) => {
    setAssignments(prev =>
      prev.map(a =>
        a.id === assignmentId ? { ...a, is_active: !a.is_active } : a
      )
    );
  };

  if (!canUseFeature) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              Premium Feature
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Multiple Templates</h3>
              <p className="text-sm text-gray-600 mb-4">
                {getUpgradeMessage('multipleTemplates')}
              </p>
              <Button className="w-full">
                Upgrade Plan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Template Assignments: "{campaign.name}"
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-6">
          {/* Add Template Section */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Add Template</h3>
            <div className="flex gap-3">
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="">Select a template...</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} {template.is_premium ? '(Premium)' : ''}
                  </option>
                ))}
              </select>
              <Button
                onClick={addTemplate}
                disabled={!selectedTemplate || isLoading}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          {/* Current Assignments */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">
                Assigned Templates ({assignments.length})
              </h3>
              {assignments.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={validateAssignments}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  Validate
                </Button>
              )}
            </div>

            {assignments.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No templates assigned</p>
                <p className="text-xs text-gray-500">Add templates to enhance your campaign</p>
              </div>
            ) : (
              <div className="space-y-3">
                {validationResults && !validationResults.valid && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="text-sm font-medium text-red-800 mb-1">Validation Errors:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {validationResults.errors.map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-red-600 mt-2">
                      Coverage: {validationResults.coverage_percentage}%
                    </p>
                  </div>
                )}
                
                {assignments.map((assignment, index) => {
                  const template = templates.find(t => t.id === assignment.template_id);
                  
                  return (
                    <div key={assignment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">
                              {assignment.template_name}
                            </h4>
                            <Badge
                              variant={assignment.assignment_type === 'primary' ? 'default' : 'outline'}
                              className="text-xs"
                            >
                              {assignment.assignment_type}
                            </Badge>
                            {template?.is_premium && (
                              <Badge variant="outline" className="text-xs">
                                <Crown className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                          
                          {template?.description && (
                            <p className="text-sm text-gray-600 mb-2">
                              {template.description}
                            </p>
                          )}

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1 text-sm">
                              <input
                                type="checkbox"
                                checked={assignment.is_active}
                                onChange={() => toggleActive(assignment.id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              Active
                            </label>
                            
                            <button
                              onClick={() => toggleAssignmentType(assignment.id)}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Switch to {assignment.assignment_type === 'primary' ? 'fallback' : 'primary'}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeTemplate(assignment.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            {assignments.filter(a => a.is_active).length} active templates
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveAssignments}
              disabled={isSaving || assignments.length === 0}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Save Assignments
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
