"use client";

import { ResponsiveModal } from "@/components/custom/responsive-modal"; // Adjust path
import { Button } from "@/components/ui/button"; // Adjust path
import type { Component } from "@/lib/types"; // Adjust path, use type
import { Loader, Trash, AlertTriangle } from "lucide-react"; // Import icons
import { useState } from "react";
import { toast } from "sonner";
import { deleteComponent } from "@/views/component/api/component"; // Adjust path

interface DeleteComponentProps {
  component: Component;
  triggerButton: React.ReactNode; // Expect trigger
  onSuccess?: () => void; // Success callback
}

export const DeleteComponent = ({
  component,
  triggerButton,
  onSuccess,
}: DeleteComponentProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const title = `删除配件 ${component?.name ?? ""}`;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { msg, status } = await deleteComponent(component.id);
      if (status === "success") {
        toast.success(msg);
        setOpen(false); // Close modal
        onSuccess?.(); // Trigger refresh
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error("删除失败，请稍后重试。");
      console.error("Delete component error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setIsDeleting(false); // Reset on close
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      title={title}
      description="此操作不可逆，配件信息将被永久删除。"
      triggerButton={triggerButton} // Use passed trigger
      dialogClassName="sm:max-w-sm"
      showMobileFooter={false} // Disable default footer
    >
      <div className="space-y-4 px-1">
        <div className="flex items-start gap-3 rounded-md border border-destructive/50 bg-destructive/5 p-3 text-destructive">
          <AlertTriangle className="size-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm ">
            确定要永久删除配件{" "}
            <span className="font-semibold">
              [{component?.name ?? "此配件"}]
            </span>{" "}
            吗?
          </p>
        </div>
        {/* Action buttons */}
        <div className="flex w-full justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => handleModalChange(false)}
            disabled={isDeleting}
          >
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader className="mr-2 animate-spin size-4" />
            ) : null}
            确认删除
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  );
};
