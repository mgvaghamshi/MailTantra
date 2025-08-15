"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { Campaign } from "@/lib/emailtracker-api";
import { toast } from "sonner";

interface CampaignExportProps {
  campaigns: Campaign[];
  filteredCampaigns: Campaign[];
  className?: string;
}

export function CampaignExport({ campaigns, filteredCampaigns, className = "" }: CampaignExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = async (data: Campaign[], filename: string) => {
    setIsExporting(true);
    
    try {
      const headers = [
        'Name',
        'Subject', 
        'Status',
        'Recipients',
        'Sent Count',
        'Open Rate (%)',
        'Click Rate (%)',
        'Created At',
        'Sent At'
      ];

      const csvContent = [
        headers.join(','),
        ...data.map(campaign => [
          `"${campaign.name}"`,
          `"${campaign.subject}"`,
          campaign.status,
          campaign.recipients_count,
          campaign.sent_count,
          campaign.open_rate,
          campaign.click_rate,
          campaign.created_at,
          campaign.sent_at || ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exported ${data.length} campaigns to CSV`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export campaigns');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = async (data: Campaign[], filename: string) => {
    setIsExporting(true);
    
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exported ${data.length} campaigns to JSON`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export campaigns');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="default" 
          className={`border-gray-200 hover:bg-gray-50 ${className}`}
          disabled={isExporting || campaigns.length === 0}
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => exportToCSV(filteredCampaigns, 'campaigns-filtered.csv')}
          disabled={filteredCampaigns.length === 0}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export Filtered as CSV ({filteredCampaigns.length})
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => exportToJSON(filteredCampaigns, 'campaigns-filtered.json')}
          disabled={filteredCampaigns.length === 0}
        >
          <FileText className="mr-2 h-4 w-4" />
          Export Filtered as JSON ({filteredCampaigns.length})
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => exportToCSV(campaigns, 'campaigns-all.csv')}
          disabled={campaigns.length === 0}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export All as CSV ({campaigns.length})
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => exportToJSON(campaigns, 'campaigns-all.json')}
          disabled={campaigns.length === 0}
        >
          <FileText className="mr-2 h-4 w-4" />
          Export All as JSON ({campaigns.length})
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
