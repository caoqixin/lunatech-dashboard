"use client";

import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Button } from "@/components/ui/button";
import { Component } from "@/lib/types";
import { Loader, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteComponent } from "@/views/component/api/component";

interface DeleteComponentProps {
  component: Component;
}

export const DeleteComponent = ({ component }: DeleteComponentProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const { msg, status } = await deleteComponent(component.id);
    if (status == "success") {
      toast.success(msg);
      setOpen(false);
      router.refresh();
    } else {
      toast.error(msg);
    }
    setIsDeleting(false);
  };
  return (
    <ResponsiveModal
      open={open}
      onOpen={setOpen}
      title={`删除配件 ${component.name}`}
      triggerButton={
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-2"
        >
          <Trash className="size-4" /> 删除
        </Button>
      }
    >
      <div className="flex flex-col space-y-4 mx-4">
        <p className="text-destructive">
          确定要删除配件 [{component.name}] 吗?, 该操作是不可逆, 慎重考虑 !!!
        </p>
        <Button
          variant="destructive"
          className="flex w-full gap-2 items-center"
          onClick={() => handleDelete()}
          disabled={isDeleting}
        >
          {isDeleting && <Loader className="animate-spin size-4" />}
          确定
        </Button>
      </div>
    </ResponsiveModal>
  );
};
