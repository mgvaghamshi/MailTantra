"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  FlaskConical, 
  Plus, 
  Trash2, 
  BarChart3,
  Clock,
  Target,
  Loader2,
  AlertCircle,
  Crown
} from "lucide-react";
import { Campaign, ABTestConfig, ABTestVariation, emailTrackerAPI } from "@/lib/emailtracker-api";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { toast } from "sonner";

interface ABTestDialogProps {
  campaign: Campaign;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ABTestDialog({ 
  campaign, 
  open, 
  onOpenChange, 
  onSuccess 
}: ABTestDialogProps) {
  const { hasAccess, getUpgradeMessage } = useUserPermissions();
  const [isCreating, setIsCreating] = useState(false);
  const [config, setConfig] = useState<Partial<ABTestConfig>>({
    variations: [
      {
        id: 'variation_a',
        name: 'Version A (Original)',
        subject: campaign.subject,
        recipients_assigned: 0,
        metrics: { sent: 0, opened: 0, clicked: 0, open_rate: 0, click_rate: 0 }
      },
      {
        id: 'variation_b',
        name: 'Version B',
        subject: '',
        recipients_assigned: 0,
        metrics: { sent: 0, opened: 0, clicked: 0, open_rate: 0, click_rate: 0 }
      }
    ],
    split_percentage: 50,
    test_duration_hours: 24,
    winner_metric: 'open_rate',
    auto_select_winner: true,
    status: 'running'
  });

  const canUseFeature = hasAccess('abTesting');

  const addVariation = () => {
    if (!config.variations) return;
    
    const newVariation: ABTestVariation = {
      id: `variation_${Date.now()}`,
      name: `Version ${String.fromCharCode(65 + config.variations.length)}`,
      subject: '',
      recipients_assigned: 0,
      metrics: { sent: 0, opened: 0, clicked: 0, open_rate: 0, click_rate: 0 }
    };
    
    setConfig(prev => ({
      ...prev,
      variations: [...(prev.variations || []), newVariation]
    }));
  };

  const removeVariation = (variationId: string) => {
    if (!config.variations || config.variations.length <= 2) {
      toast.error('A/B test must have at least 2 variations');
      return;
    }
    
    setConfig(prev => ({
      ...prev,
      variations: prev.variations?.filter(v => v.id !== variationId)
    }));
  };

  const updateVariation = (variationId: string, field: keyof ABTestVariation, value: string) => {
    setConfig(prev => ({
      ...prev,
      variations: prev.variations?.map(v => 
        v.id === variationId ? { ...v, [field]: value } : v
      )
    }));
  };

  const handleCreate = async () => {
    if (!canUseFeature) {
      toast.error(getUpgradeMessage('abTesting'));
      return;
    }

    if (!config.variations || config.variations.length < 2) {
      toast.error('A/B test requires at least 2 variations');
      return;
    }

    if (config.variations.some(v => !v.subject?.trim())) {
      toast.error('All variations must have a subject line');
      return;
    }

    setIsCreating(true);

    try {
      await emailTrackerAPI.createABTest(campaign.id, config);
      
      toast.success('A/B test created successfully!', {
        description: `Testing ${config.variations.length} variations with ${config.split_percentage}% split`
      });
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create A/B test:', error);
      toast.error('Failed to create A/B test', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsCreating(false);
    }
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
              <FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">A/B Testing</h3>
              <p className="text-sm text-gray-600 mb-4">
                {getUpgradeMessage('abTesting')}
              </p>
              <Button className="w-full">
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-blue-600" />
            Create A/B Test for "{campaign.name}"
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Test Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="split">Split Percentage</Label>
              <select 
                id="split"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={config.split_percentage?.toString()} 
                onChange={(e) => setConfig(prev => ({ ...prev, split_percentage: parseInt(e.target.value) }))}
              >
                <option value="50">50/50 Split</option>
                <option value="70">70/30 Split</option>
                <option value="80">80/20 Split</option>
                <option value="90">90/10 Split</option>
              </select>
            </div>

            <div>
              <Label htmlFor="duration">Test Duration (Hours)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="168"
                value={config.test_duration_hours || 24}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  test_duration_hours: parseInt(e.target.value) 
                }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="metric">Winner Metric</Label>
              <select 
                id="metric"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={config.winner_metric} 
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  winner_metric: e.target.value as 'open_rate' | 'click_rate' | 'conversion_rate'
                }))}
              >
                <option value="open_rate">Open Rate</option>
                <option value="click_rate">Click Rate</option>
                <option value="conversion_rate">Conversion Rate</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="auto-select"
                checked={config.auto_select_winner}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  auto_select_winner: e.target.checked 
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="auto-select" className="text-sm">
                Auto-select winner after test duration
              </Label>
            </div>
          </div>

          {/* Variations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-semibold">Test Variations</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariation}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Variation
              </Button>
            </div>

            <div className="space-y-4">
              {config.variations?.map((variation, index) => (
                <div key={variation.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{variation.name}</Badge>
                      {index === 0 && <Badge variant="secondary">Original</Badge>}
                    </div>
                    {config.variations && config.variations.length > 2 && index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariation(variation.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`name-${variation.id}`}>Variation Name</Label>
                      <Input
                        id={`name-${variation.id}`}
                        value={variation.name}
                        onChange={(e) => updateVariation(variation.id, 'name', e.target.value)}
                        placeholder="e.g., Version A"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`subject-${variation.id}`}>Subject Line</Label>
                      <Input
                        id={`subject-${variation.id}`}
                        value={variation.subject || ''}
                        onChange={(e) => updateVariation(variation.id, 'subject', e.target.value)}
                        placeholder="Enter subject line for this variation"
                      />
                    </div>

                    {variation.html_content !== undefined && (
                      <div>
                        <Label htmlFor={`content-${variation.id}`}>Email Content (Optional)</Label>
                        <Textarea
                          id={`content-${variation.id}`}
                          value={variation.html_content || ''}
                          onChange={(e) => updateVariation(variation.id, 'html_content', e.target.value)}
                          placeholder="Leave empty to use original campaign content"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Important:</p>
                <p>
                  Once the A/B test starts, variations cannot be modified. 
                  Make sure all subject lines and content are finalized.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Test...
              </>
            ) : (
              <>
                <FlaskConical className="mr-2 h-4 w-4" />
                Create A/B Test
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
