"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { WarrantyWithRepair } from "@/lib/definitions";
import { CountdownTimerIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export function WarrantyCellAction({ data }: { data: WarrantyWithRepair }) {
  const { toast } = useToast();
  const router = useRouter();
  const rework = async () => {
    const res = await fetch(`/api/v1/warranties/rework/${data.id}`, {
      method: "PUT",
    });

    const resData = await res.json();

    if (resData.status == "success") {
      toast({
        title: resData.msg,
      });
    } else {
      toast({
        title: resData.msg,
        variant: "destructive",
      });
    }
    router.refresh();
  };
  return (
    <div className="flex items-center gap-3 justify-end">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => rework()}
      >
        <CountdownTimerIcon className="w-4 h-4" /> 返修
      </Button>
    </div>
  );
}
