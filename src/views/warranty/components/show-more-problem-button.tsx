"use client";

import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  if (!problems || problems.length <= 1) {
    return null; // Or return a disabled button, or nothing
  }

  const additionalProblemCount = problems.length - 1;

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      title={`维修问题详情`}
      description={`手机: ${phone} (保修ID: ${id})`} // Use description for details
      triggerButton={
        // Tooltip might be nice here to show "查看 X 个更多问题"
        <Button
          variant="outline"
          size="sm" // Consistent size
          className="h-6 px-1.5 flex items-center text-xs" // Reduced height/padding
          aria-label={`查看其余 ${additionalProblemCount} 个问题`}
        >
          <Plus className="size-3 mr-0.5" />
          {additionalProblemCount}
        </Button>
      }
      dialogClassName="sm:max-w-sm"
      showMobileFooter={true}
    >
      <ScrollArea className="max-h-[40vh] pr-3">
        {" "}
        {/* Limit height and add scroll */}
        <div className="flex flex-wrap gap-2 py-2">
          {problems.map((problem, index) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {" "}
              {/* Use secondary variant */}
              {problem}
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </ResponsiveModal>
  );
};
