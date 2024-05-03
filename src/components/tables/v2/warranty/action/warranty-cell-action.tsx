"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { reworkWarranty } from "@/lib/actions/server/warranties";
import { CountdownTimerIcon } from "@radix-ui/react-icons";

export function WarrantyCellAction({
  id,
  phone,
  cutomer,
}: {
  id: string;
  phone: string;
  cutomer: string;
}) {
  const { toast } = useToast();
  const rework = async () => {
    const resData = await reworkWarranty(id, cutomer, phone);

    if (resData.status === "success") {
      toast({
        title: resData.msg,
      });
    } else {
      toast({
        title: resData.msg,
        variant: "destructive",
      });
    }
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
