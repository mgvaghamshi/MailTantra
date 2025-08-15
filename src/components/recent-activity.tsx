"use client"

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEmailTrackers } from "@/hooks/use-emailtracker";
import { EmailTracker } from "@/lib/emailtracker-api";
import { 
  Mail, 
  Eye, 
  MousePointer, 
  AlertTriangle,
  Clock,
  Loader2
} from "lucide-react";

function getActivityIcon(status: string) {
  switch (status) {
    case 'opened':
      return <Eye className="h-4 w-4 text-green-500" />;
    case 'clicked':
      return <MousePointer className="h-4 w-4 text-blue-500" />;
    case 'delivered':
      return <Mail className="h-4 w-4 text-green-500" />;
    case 'bounced':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'sent':
      return <Mail className="h-4 w-4 text-gray-500" />;
    default:
      return <Mail className="h-4 w-4 text-gray-400" />;
  }
}

function getTrackerStatus(tracker: EmailTracker): string {
  if (tracker.bounced) return 'bounced';
  if (tracker.complained) return 'complaint';
  if (tracker.unsubscribed) return 'unsubscribed';
  if (tracker.click_count > 0) return 'clicked';
  if (tracker.open_count > 0) return 'opened';
  if (tracker.delivered) return 'delivered';
  return 'sent';
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'opened':
      return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Opened</Badge>;
    case 'clicked':
      return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Clicked</Badge>;
    case 'bounced':
      return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Bounced</Badge>;
    case 'delivered':
      return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Delivered</Badge>;
    case 'sent':
      return <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">Sent</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

export function RecentActivity() {
  const { data: trackersResponse, loading, error } = useEmailTrackers({ 
    limit: 10, 
    page: 1 
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading recent activity...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Failed to load recent activity</p>
              <p className="text-xs text-red-500 mt-1">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const trackers = trackersResponse || [];

  if (trackers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Mail className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No recent activity</p>
            <p className="text-xs text-gray-500 mt-1">Email activity will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trackers.map((tracker) => (
            <div key={tracker.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(getTrackerStatus(tracker))}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {tracker.subject}
                  </p>
                  {getStatusBadge(getTrackerStatus(tracker))}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {tracker.recipient_email}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(tracker.sent_at || tracker.created_at)}
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    {tracker.open_count > 0 && (
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {tracker.open_count}
                      </span>
                    )}
                    {tracker.click_count > 0 && (
                      <span className="flex items-center">
                        <MousePointer className="h-3 w-3 mr-1" />
                        {tracker.click_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {trackers.length >= 10 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all activity
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
