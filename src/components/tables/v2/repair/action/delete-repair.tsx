"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteRepair({ id, phone }: { id: number; phone: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const deleteRepair = async () => {
    const res = await fetch(`/api/v1/repairs/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.status == "success") {
      toast({
        title: data.msg,
      });
    } else {
      toast({
        title: data.msg,
        variant: "destructive",
      });
    }

    setOpen(false);
    router.refresh();
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <TrashIcon className="w-4 h-4" /> 删除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">
            确定要停止 "{phone}" 的维修吗?{" "}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={() => deleteRepair()}
          >
            确定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
