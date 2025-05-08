"use client";

import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

interface ShowMoreProblemButtonProps {
  problems?: string[] | null;
  id: number;
  phone: string;
}

export const ShowMoreProblemButton = ({
  problems,
  id,
  phone,
}: ShowMoreProblemButtonProps) => {
  const [open, setOpen] = useState(false);

  const validProblems = useMemo(
    () =>
      problems?.filter((p) => typeof p === "string" && p.trim() !== "") ?? [],
    [problems]
  );
  // Only render button if there are more than 1 problem to show
  if (validProblems.length <= 1) {
    return null; // Don't show button if 0 or 1 extra problem
  }

  const additionalProblemCount = validProblems.length - 1;

  // Memoize badge items
  const badgeItems = useMemo(
    () =>
      validProblems.map((problem, index) => (
        <Badge key={index} variant="secondary" className="text-sm px-2 py-0.5">
          {problem}
        </Badge>
      )),
    [validProblems]
  );

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen} // Use direct setter
      title={`维修故障详情`} // Simplified title
      description={`手机: ${phone} (维修ID: #${id})`} // Details in description
      triggerButton={
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-1.5 flex items-center text-xs"
          aria-label={`查看其余 ${additionalProblemCount} 个故障`}
        >
          <Plus className="size-3 mr-0.5" />
          {additionalProblemCount}
        </Button>
      }
      dialogClassName="sm:max-w-sm" // Standard width
      showMobileFooter={true} // Keep close button
    >
      <ScrollArea className="max-h-[40vh] pr-1">
        <div className="flex flex-wrap gap-2 py-2">{badgeItems}</div>
      </ScrollArea>
    </ResponsiveModal>
  );
};
