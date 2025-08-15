"use client"

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Users, 
  Key, 
  FileText, 
  Settings, 
  BarChart3,
  Upload,
  Plus,
  ArrowRight
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

export function QuickActions() {
  const quickActions: QuickAction[] = [
    {
      id: "new-campaign",
      title: "Create Campaign",
      description: "Start a new email campaign",
      icon: <Mail className="h-5 w-5" />,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => console.log("Create campaign")
    },
    {
      id: "add-contacts",
      title: "Import Contacts",
      description: "Upload subscriber list",
      icon: <Upload className="h-5 w-5" />,
      color: "bg-green-500 hover:bg-green-600",
      action: () => console.log("Import contacts")
    },
    {
      id: "new-template",
      title: "Design Template",
      description: "Create email template",
      icon: <FileText className="h-5 w-5" />,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => console.log("Design template")
    },
    {
      id: "api-key",
      title: "Generate API Key",
      description: "Create new API access key",
      icon: <Key className="h-5 w-5" />,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => console.log("Generate API key")
    },
    {
      id: "view-analytics",
      title: "View Analytics",
      description: "Check campaign performance",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "bg-indigo-500 hover:bg-indigo-600",
      action: () => console.log("View analytics")
    },
    {
      id: "settings",
      title: "SMTP Settings",
      description: "Configure email server",
      icon: <Settings className="h-5 w-5" />,
      color: "bg-gray-500 hover:bg-gray-600",
      action: () => console.log("SMTP settings")
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all duration-200 group"
              onClick={action.action}
            >
              <div className={`p-2 rounded-lg text-white ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                {action.icon}
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {action.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 ml-auto" />
            </Button>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <Button className="w-full" size="lg">
            <Plus className="mr-2 h-4 w-4" />
            New Email Campaign
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
