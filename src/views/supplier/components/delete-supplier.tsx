"use client";
import { useState } from "react";
import { toast } from "sonner";

import { Loader, AlertTriangle } from "lucide-react";
import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { deleteSupplier } from "@/views/supplier/api/supplier";

import { Button } from "@/components/ui/button";
import type { Supplier } from "@/lib/types";

interface DeleteSupplierProps {
  supplier: Supplier;
  triggerButton: React.ReactNode; // Expect trigger
  onSuccess?: () => void; // Success callback
}

export const DeleteSupplier = ({
  supplier,
  triggerButton,
  onSuccess,
}: DeleteSupplierProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const title = `删除供应商 ${supplier?.name ?? ""}`;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { msg, status } = await deleteSupplier(supplier.id);
      if (status === "success") {
        toast.success(msg);
        setOpen(false); // Close modal
        onSuccess?.(); // Trigger refresh
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error("删除失败，请稍后重试。");
      console.error("Delete supplier error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setIsDeleting(false); // Reset deleting state
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      triggerButton={triggerButton} // Use passed trigger
      title={title}
      description="此操作不可逆，删除后供应商信息将无法恢复。" // Clear description
      dialogClassName="sm:max-w-sm" // Limit width
      showMobileFooter={false}
    >
      <div className="space-y-4">
        {/* Warning message */}
        <div className="flex items-start gap-3 rounded-md border border-destructive/50 bg-destructive/5 p-3 text-destructive">
          <AlertTriangle className="size-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm ">
            确定要永久删除供应商{" "}
            <span className="font-semibold">
              [{supplier?.name ?? "此供应商"}]
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
