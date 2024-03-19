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

export function DeleteSupplier({ id, name }: { id: number; name: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const deleteSupplier = async () => {
    const res = await fetch(`http://localhost:3000/api/v1/suppliers/${id}`, {
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <TrashIcon className="w-4 h-4" /> 删除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">
            确定要删除 "{name}" 吗?{" "}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={() => deleteSupplier()}
          >
            确定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
