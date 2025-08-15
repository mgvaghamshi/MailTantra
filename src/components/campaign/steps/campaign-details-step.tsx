"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Type, 
  FileText, 
  Tag,
  Megaphone,
  Send,
  Bell,
  UserPlus,
  RotateCcw,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CampaignFormData, CampaignType, ValidationError } from "@/types/campaign";

interface CampaignDetailsStepProps {
  data: Partial<CampaignFormData>;
  errors: ValidationError[];
  onChange: (data: Partial<CampaignFormData>) => void;
}

const campaignTypes: Array<{
  type: CampaignType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}> = [
  {
    type: "newsletter",
    label: "Newsletter",
    description: "Regular updates and content for subscribers",
    icon: <Mail className="h-5 w-5" />,
    color: "blue"
  },
  {
    type: "promotional", 
    label: "Promotional",
    description: "Sales, discounts, and special offers",
    icon: <Megaphone className="h-5 w-5" />,
    color: "purple"
  },
  {
    type: "transactional",
    label: "Transactional", 
    description: "Order confirmations and receipts",
    icon: <Send className="h-5 w-5" />,
    color: "green"
  },
  {
    type: "announcement",
    label: "Announcement",
    description: "Important company or product news",
    icon: <Bell className="h-5 w-5" />,
    color: "orange"
  },
  {
    type: "welcome",
    label: "Welcome Series",
    description: "Onboarding new subscribers",
    icon: <UserPlus className="h-5 w-5" />,
    color: "teal"
  },
  {
    type: "reengagement",
    label: "Re-engagement",
    description: "Win back inactive subscribers",
    icon: <RotateCcw className="h-5 w-5" />,
    color: "red"
  }
];

export function CampaignDetailsStep({ data, errors, onChange }: CampaignDetailsStepProps) {
  const [customTags, setCustomTags] = useState<string[]>(data.tags || []);
  const [newTag, setNewTag] = useState("");

  const getError = (field: string) => errors.find(e => e.field === field)?.message;

  const handleInputChange = (field: keyof CampaignFormData, value: any) => {
    onChange({ [field]: value });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      const updatedTags = [...customTags, newTag.trim()];
      setCustomTags(updatedTags);
      handleInputChange('tags', updatedTags);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = customTags.filter(tag => tag !== tagToRemove);
    setCustomTags(updatedTags);
    handleInputChange('tags', updatedTags);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Campaign Details</h2>
        <p className="text-slate-600 max-w-lg mx-auto">
          Let's start by setting up the basic information for your email campaign. 
          This will help you organize and identify your campaign later.
        </p>
      </div>

      {/* Campaign Basic Info */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5 text-blue-600" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Essential details that define your campaign
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campaign Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Campaign Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g., Summer Sale Newsletter 2024"
              value={data.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={cn("text-base", getError("name") && "border-red-500")}
            />
            {getError("name") && (
              <p className="text-sm text-red-600">{getError("name")}</p>
            )}
            <p className="text-xs text-slate-500">
              Choose a descriptive name that helps you identify this campaign
            </p>
          </div>

          {/* Subject Line */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">
              Email Subject Line *
            </Label>
            <Input
              id="subject"
              placeholder="e.g., Don't miss our summer sale - 30% off everything!"
              value={data.subject || ""}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className={cn("text-base", getError("subject") && "border-red-500")}
            />
            {getError("subject") && (
              <p className="text-sm text-red-600">{getError("subject")}</p>
            )}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>This is what recipients will see in their inbox</span>
              <span className={cn(
                "font-medium",
                (data.subject?.length || 0) > 50 ? "text-orange-600" : "text-green-600"
              )}>
                {data.subject?.length || 0}/50 recommended
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Campaign Description <span className="text-slate-400">(Optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Internal notes about this campaign's purpose, target audience, or goals..."
              value={data.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="text-base resize-none"
            />
            <p className="text-xs text-slate-500">
              Internal notes to help your team understand this campaign's purpose
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Type Selection */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Campaign Type
          </CardTitle>
          <CardDescription>
            Select the type that best describes your campaign's purpose
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaignTypes.map((type) => (
              <button
                key={type.type}
                onClick={() => handleInputChange("type", type.type)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                  "hover:shadow-md hover:scale-105",
                  data.type === type.type
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    data.type === type.type ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
                  )}>
                    {type.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 mb-1">
                      {type.label}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {getError("type") && (
            <p className="text-sm text-red-600 mt-3">{getError("type")}</p>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-blue-600" />
            Campaign Tags
          </CardTitle>
          <CardDescription>
            Add tags to organize and categorize your campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tag Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleAddTag}
              disabled={!newTag.trim() || customTags.includes(newTag.trim())}
              variant="outline"
            >
              Add Tag
            </Button>
          </div>

          {/* Display Tags */}
          {customTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Suggested Tags */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Suggested tags:</p>
            <div className="flex flex-wrap gap-2">
              {["marketing", "sales", "product-update", "seasonal", "urgent"].map((suggestedTag) => (
                <Button
                  key={suggestedTag}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!customTags.includes(suggestedTag)) {
                      const updatedTags = [...customTags, suggestedTag];
                      setCustomTags(updatedTags);
                      handleInputChange('tags', updatedTags);
                    }
                  }}
                  disabled={customTags.includes(suggestedTag)}
                  className="text-xs"
                >
                  + {suggestedTag}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
