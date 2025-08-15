"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  Users,
  TrendingUp,
  Download,
  Filter,
  Search,
  Crown,
  Loader2,
  RefreshCcw,
  Eye,
  MousePointer,
  Send,
  Truck,
  MoreHorizontal,
  Calendar
} from "lucide-react";
import { Campaign, CampaignDeliveryLog, CampaignDeliveryResponse, DeliveryEvent, emailTrackerAPI } from "@/lib/emailtracker-api";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { toast } from "sonner";

interface CampaignLogsDialogProps {
  campaign: Campaign;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EventTimelineModalProps {
  log: CampaignDeliveryLog;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_ICONS = {
  delivered: CheckCircle,
  bounced: XCircle,
  sent: Send,
  pending: Clock
} as const;

const STATUS_COLORS = {
  delivered: 'bg-green-100 text-green-800 border-green-200',
  bounced: 'bg-red-100 text-red-800 border-red-200',
  sent: 'bg-blue-100 text-blue-800 border-blue-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
} as const;

const EVENT_ICONS = {
  sent: Send,
  delivered: Truck,
  opened: Eye,
  clicked: MousePointer,
  bounced: XCircle
} as const;

const EVENT_COLORS = {
  sent: 'text-blue-600',
  delivered: 'text-green-600',
  opened: 'text-purple-600',
  clicked: 'text-orange-600',
  bounced: 'text-red-600'
} as const;

function EventTimelineModal({ log, open, onOpenChange }: EventTimelineModalProps) {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Event Timeline: {log.recipient_email}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Recipient Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{log.recipient_email}</h3>
                <p className="text-sm text-gray-600">Status: {log.status}</p>
              </div>
              <Badge 
                className={`${STATUS_COLORS[log.status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800'}`}
                variant="outline"
              >
                {log.status}
              </Badge>
            </div>
          </div>

          {/* Events Timeline */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Event Timeline
            </h4>
            
            {log.events && log.events.length > 0 ? (
              <div className="space-y-3">
                {log.events.map((event, index) => {
                  const Icon = EVENT_ICONS[event.type as keyof typeof EVENT_ICONS] || Activity;
                  const colorClass = EVENT_COLORS[event.type as keyof typeof EVENT_COLORS] || 'text-gray-600';
                  
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white border rounded-lg">
                      <div className={`p-2 rounded-full bg-gray-100 ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium capitalize">{event.type}</h5>
                          <span className="text-sm text-gray-500">
                            {formatTimestamp(event.timestamp)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <div><strong>Status:</strong> {event.status}</div>
                          {event.count && <div><strong>Count:</strong> {event.count}</div>}
                          {event.reason && <div><strong>Reason:</strong> {event.reason}</div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No events recorded for this recipient</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CampaignLogsDialog({ campaign, open, onOpenChange }: CampaignLogsDialogProps) {
  const { hasAccess, getUpgradeMessage } = useUserPermissions();
  const [logs, setLogs] = useState<CampaignDeliveryLog[]>([]);
  const [summary, setSummary] = useState<CampaignDeliveryResponse['summary']>({
    total_recipients: 0,
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<CampaignDeliveryLog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'email' | 'status' | 'sent' | 'opened' | 'clicked'>('email');

  const canUseFeature = hasAccess('deliveryLogs');

  const loadLogs = async () => {
    if (!campaign?.id) return;
    
    setIsLoading(true);
    try {
      const response = await emailTrackerAPI.getCampaignLogs(campaign.id);
      setLogs(response.logs);
      setSummary(response.summary);
    } catch (error) {
      console.error('Failed to load campaign logs:', error);
      toast.error('Failed to load delivery logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && campaign?.id && canUseFeature) {
      loadLogs();
    }
  }, [open, campaign?.id, canUseFeature]);

  const filteredLogs = logs
    .filter(log => {
      const matchesSearch = log.recipient_email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'email':
          return a.recipient_email.localeCompare(b.recipient_email);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'sent':
          return (b.timestamps.sent_at || '').localeCompare(a.timestamps.sent_at || '');
        case 'opened':
          return (b.delivery_stats.open_count || 0) - (a.delivery_stats.open_count || 0);
        case 'clicked':
          return (b.delivery_stats.click_count || 0) - (a.delivery_stats.click_count || 0);
        default:
          return 0;
      }
    });

  const exportLogs = () => {
    const csvContent = [
      ['Recipient', 'Status', 'Sent At', 'Delivered At', 'Opened At', 'First Click At', 'Opens', 'Clicks'].join(','),
      ...filteredLogs.map(log => [
        log.recipient_email,
        log.status,
        log.timestamps.sent_at || '',
        log.timestamps.delivered_at || '',
        log.timestamps.opened_at || '',
        log.timestamps.first_click_at || '',
        log.delivery_stats.open_count?.toString() || '0',
        log.delivery_stats.click_count?.toString() || '0'
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaign.name}-delivery-logs.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Logs</h3>
              <p className="text-sm text-gray-600 mb-4">
                {getUpgradeMessage('deliveryLogs')}
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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Delivery Logs: {campaign.name}
            </DialogTitle>
          </DialogHeader>

          {/* Summary Stats */}
          <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{summary.total_recipients}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.delivered}</div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summary.bounced}</div>
              <div className="text-sm text-gray-600">Bounced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{summary.opened}</div>
              <div className="text-sm text-gray-600">Opened</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{summary.clicked}</div>
              <div className="text-sm text-gray-600">Clicked</div>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadLogs}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportLogs}
                className="flex items-center gap-1"
                disabled={filteredLogs.length === 0}
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
                  <p className="text-gray-600">Loading delivery logs...</p>
                </div>
              </div>
            ) : filteredLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th 
                        className="text-left p-3 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => setSortBy('email')}
                      >
                        Recipient {sortBy === 'email' && '↓'}
                      </th>
                      <th 
                        className="text-left p-3 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => setSortBy('status')}
                      >
                        Status {sortBy === 'status' && '↓'}
                      </th>
                      <th 
                        className="text-left p-3 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => setSortBy('sent')}
                      >
                        Sent {sortBy === 'sent' && '↓'}
                      </th>
                      <th className="text-left p-3 font-medium text-gray-700">Delivered</th>
                      <th 
                        className="text-left p-3 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => setSortBy('opened')}
                      >
                        Opens {sortBy === 'opened' && '↓'}
                      </th>
                      <th 
                        className="text-left p-3 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => setSortBy('clicked')}
                      >
                        Clicks {sortBy === 'clicked' && '↓'}
                      </th>
                      <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log, index) => {
                      const StatusIcon = STATUS_ICONS[log.status as keyof typeof STATUS_ICONS] || Clock;
                      const statusColor = STATUS_COLORS[log.status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800';
                      
                      return (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="font-medium">{log.recipient_email}</div>
                          </td>
                          <td className="p-3">
                            <Badge className={`${statusColor} flex items-center gap-1 w-fit`} variant="outline">
                              <StatusIcon className="h-3 w-3" />
                              {log.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {log.timestamps.sent_at ? new Date(log.timestamps.sent_at).toLocaleString() : 'Not sent'}
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {log.timestamps.delivered_at ? new Date(log.timestamps.delivered_at).toLocaleString() : 'Not delivered'}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{log.delivery_stats.open_count || 0}</span>
                              {log.timestamps.opened_at && (
                                <span className="text-xs text-gray-500">
                                  (First: {new Date(log.timestamps.opened_at).toLocaleDateString()})
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{log.delivery_stats.click_count || 0}</span>
                              {log.timestamps.first_click_at && (
                                <span className="text-xs text-gray-500">
                                  (First: {new Date(log.timestamps.first_click_at).toLocaleDateString()})
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedLog(log)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              Timeline
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">No Delivery Logs</h3>
                <p className="text-sm text-gray-600">
                  {logs.length === 0 
                    ? "No delivery data available for this campaign yet."
                    : "No recipients match your search criteria."
                  }
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {filteredLogs.length} of {logs.length} recipients
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Timeline Modal */}
      {selectedLog && (
        <EventTimelineModal
          log={selectedLog}
          open={!!selectedLog}
          onOpenChange={(open) => !open && setSelectedLog(null)}
        />
      )}
    </>
  );
}