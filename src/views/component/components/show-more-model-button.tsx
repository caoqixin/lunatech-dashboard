"use client";

import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

interface ShowMoreModelButtonProps {
  models: string[];
  name: string;
}

export const ShowMoreModelButton = ({
  models,
  name,
}: ShowMoreModelButtonProps) => {
  const [open, setOpen] = useState(false);
  // Filter out empty strings and ensure it's an array
  const validModels = useMemo(
    () => models?.filter((m) => typeof m === "string" && m.trim() !== "") ?? [],
    [models]
  );

  // Only render button if there are more than 1 model to show
  if (validModels.length <= 1) {
    return null; // Don't show button if 0 or 1 extra model
  }

  // Show the count of *additional* models
  const additionalModelCount = validModels.length - 1;

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange} // Pass the handler
      title={`适配机型 - ${name}`} // More specific title
      description={`显示 ${name} 支持的所有 ${validModels.length} 个手机型号`} // Add description
      triggerButton={
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-1.5 flex items-center text-xs"
          aria-label={`查看其余 ${additionalModelCount} 个适配机型`}
        >
          <Plus className="size-3 mr-0.5" />
          {additionalModelCount}
        </Button>
      }
      dialogClassName="sm:max-w-md"
      showMobileFooter={true}
    >
      <ScrollArea className="h-[50vh] pr-3">
        {" "}
        {/* Limit height */}
        <div className="flex flex-wrap gap-2 py-2">
          {validModels.map((model, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-sm px-2 py-0.5"
            >
              {" "}
              {/* Slightly larger badge */}
              {model}
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </ResponsiveModal>
  );
};
