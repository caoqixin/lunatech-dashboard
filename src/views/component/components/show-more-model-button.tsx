"use client";

import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

interface ShowMoreModelButtonProps {
  models: string[];
  name: string;
}

export const ShowMoreModelButton = ({
  models,
  name,
}: ShowMoreModelButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveModal
      open={open}
      onOpen={setOpen}
      title={`配件 ${name} 的适配机型`}
      triggerButton={
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-x-px w-fit"
        >
          <Plus className="size-3" />
          {models.length - 1}
        </Button>
      }
    >
      <div>
        {models.map((model, index) => (
          <Badge key={index} variant="outline">
            {model}
          </Badge>
        ))}
      </div>
    </ResponsiveModal>
  );
};
