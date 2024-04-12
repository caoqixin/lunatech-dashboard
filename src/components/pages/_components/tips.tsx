import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

interface TipsProps {
  content?: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const Tips = ({ icon, content, onClick }: TipsProps) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger
          asChild
          onClick={onClick}
          onMouseDown={(e) => e.preventDefault()}
        >
          {icon}
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Tips;
