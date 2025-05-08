"use client";

import { Button } from "@/components/ui/button";
import { LoaderCircle, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { reworkWarranty } from "@/views/warranty/api/warranty";
import { toast } from "sonner";
import { useTransition } from "react";

interface ReworkButtonProps {
  id: string;
}

export const ReworkButton = ({ id }: ReworkButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const { msg, status } = await reworkWarranty(id);
        if (status === "success") {
          toast.success(msg);
          router.refresh(); // Refresh data after successful action
        } else {
          toast.error(msg || "返修操作失败"); // Provide default error msg
        }
      } catch (error) {
        console.error("Rework failed:", error);
        toast.error("返修请求失败，请稍后重试。");
      }
    });
  };
  return (
    <Button
      variant="outline"
      size="sm" // Use small size consistently in tables
      className="flex items-center gap-1.5 h-8" // Standard height, adjust gap
      onClick={handleClick}
      disabled={isPending} // Disable while transition is pending
      aria-disabled={isPending}
      aria-live="polite" // Announce changes for screen readers
    >
      {isPending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <RotateCcw className="size-4" /> // Rework icon
      )}
      {isPending ? "处理中..." : "发起返修"}
    </Button>
  );
};
