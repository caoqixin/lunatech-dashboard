"use client";

import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

interface ShowMoreProblemButtonProps {
  problems: string[];
  id: number;
  phone: string;
}

export const ShowMoreProblemButton = ({
  problems,
  id,
  phone,
}: ShowMoreProblemButtonProps) => {
  const [open, setOpen] = useState(false);

  // Only show button if we have more than 1 problem
  const shouldShow = problems.length > 1;
  const remainingCount = problems.length - 1;

  // Memoize badges to prevent unnecessary re-renders
  const badgeItems = useMemo(
    () =>
      problems.map((model, index) => (
        <Badge key={index} variant="outline" className="m-1">
          {model}
        </Badge>
      )),
    [problems]
  );

  return (
    <ResponsiveModal
      open={open}
      onOpen={setOpen}
      title={`维修ID: [${id}], 机型: ${phone} 的维修故障`}
      triggerButton={
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-x-px w-fit transition-all hover:bg-accent"
        >
          <Plus className="size-3" />
          {remainingCount}
        </Button>
      }
    >
      <div className="p-4 flex flex-wrap justify-start items-start">
        {badgeItems}
      </div>
    </ResponsiveModal>
  );
};
