"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RefreshCcw } from "lucide-react";

export const RefreshButton = () => {
  const router = useRouter();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" onClick={() => router.refresh()}>
            <RefreshCcw className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>刷新</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
