"use client";

import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Button } from "@/components/ui/button";
import type { RepairWithCustomer } from "@/lib/types";
import { AlertTriangle, Loader, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteRepair } from "@/views/repair/api/repair";

interface DeleteRepairProps {
  repair: RepairWithCustomer;
  triggerButton: React.ReactNode; // Expect trigger
  onSuccess?: () => void; // Success callback
}

export const DeleteRepair = ({
  repair,
  triggerButton,
  onSuccess,
}: DeleteRepairProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const title = `删除维修单 #${repair.id}`;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { msg, status } = await deleteRepair(repair.id);
      if (status === "success") {
        toast.success(msg);
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(msg || "删除失败。");
      }
    } catch (error: any) {
      toast.error(`删除失败: ${error.message || "请稍后重试"}`);
      console.error("Delete repair error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setIsDeleting(false);
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      title={title}
      description="此操作不可逆，维修记录将被永久删除。"
      triggerButton={triggerButton} // Use passed trigger
      dialogClassName="sm:max-w-sm"
      showMobileFooter={false}
    >
      <div className="space-y-4 px-1">
        <div className="flex items-start gap-3 rounded-md border border-destructive/50 bg-destructive/5 p-3 text-destructive">
          <AlertTriangle className="size-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm ">
            确定要永久删除属于
            <span className="font-medium">
              {repair.customers?.name ?? "未知客户"}
            </span>
            的维修单 (<span className="font-medium">{repair.phone}</span>) 吗?
          </p>
        </div>
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
