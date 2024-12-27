"use client";

import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

interface ShowMoreProblemButtonProps {
  problems: string[];
  id: string;
  phone: string;
}

export const ShowMoreProblemButton = ({
  problems,
  id,
  phone,
}: ShowMoreProblemButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveModal
      open={open}
      onOpen={setOpen}
      title={`保修ID: [${id}], 机型: ${phone} 的维修故障`}
      triggerButton={
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-x-px w-fit"
        >
          <Plus className="size-3" />
          {problems.length - 1}
        </Button>
      }
    >
      <div>
        {problems.map((model, index) => (
          <Badge key={index} variant="outline">
            {model}
          </Badge>
        ))}
      </div>
    </ResponsiveModal>
  );
};
