"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NewCampaignDialogProps {
  onCampaignCreated?: () => void;
  redirectAfterCreate?: boolean;
  buttonText?: string;
  buttonClassName?: string;
}

export function NewCampaignDialog({ 
  onCampaignCreated,
  redirectAfterCreate = false,
  buttonText = "New Campaign",
  buttonClassName = ""
}: NewCampaignDialogProps) {
  const router = useRouter();

  const handleCreateClick = () => {
    router.push('/campaigns/create');
  };

  return (
    <Button 
      onClick={handleCreateClick}
      className={buttonClassName || "bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 h-auto shadow-md hover:shadow-lg transition-all duration-200"}
    >
      <Plus className="w-5 h-5 mr-2" />
      {buttonText}
    </Button>
  );
}
