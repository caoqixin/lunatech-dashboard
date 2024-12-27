"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { reworkWarranty } from "@/views/warranty/api/warranty";
import { toast } from "sonner";
import { useState } from "react";

interface ReworkButtonProps {
  id: string;
}

export const ReworkButton = ({ id }: ReworkButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const { msg, status } = await reworkWarranty(id);

    if (status === "success") {
      toast.success(msg);
      router.refresh();
    } else {
      toast.error(msg);
    }

    setIsLoading(false);
  };
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleClick}
      disabled={isLoading}
    >
      <LoaderCircle className={cn("size-4", isLoading && "animate-spin")} />{" "}
      {isLoading ? "返修中" : "返修"}
    </Button>
  );
};
