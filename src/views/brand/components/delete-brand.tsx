"use client";

import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Button } from "@/components/ui/button";
import type { Brand } from "@/lib/types";
import { deleteBrand } from "@/views/brand/api/brand";
import { AlertTriangle, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteBrandProps {
  brand: Brand;
  triggerButton: React.ReactNode; // Expect trigger
  onSuccess?: () => void; // Success callback
}

export const DeleteBrand = ({
  brand,
  triggerButton,
  onSuccess,
}: DeleteBrandProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const title = `删除品牌 ${brand?.name ?? ""}`;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { msg, status } = await deleteBrand(brand.id);
      if (status === "success") {
        toast.success(msg);
        setOpen(false); // Close modal
        onSuccess?.(); // Trigger refresh
      } else {
        // Check for specific error related to existing phones
        if (
          msg?.includes("violates foreign key constraint") &&
          msg?.includes("phones_brand_fkey")
        ) {
          toast.error(
            `无法删除：品牌 "${brand.name}" 下仍有关联的手机型号。请先删除或修改这些手机型号。`
          );
        } else {
          toast.error(msg || "删除失败");
        }
      }
    } catch (error: any) {
      const message = error.message || "删除失败，请稍后重试。";
      toast.error(message);
      console.error("Delete brand error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setIsDeleting(false);
  };

  return (
    // Use standard ResponsiveModal
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      triggerButton={triggerButton} // Use passed trigger
      title={title}
      description="此操作不可逆，请确认相关手机型号。"
      dialogClassName="sm:max-w-sm"
      showMobileFooter={false} // Disable default footer
    >
      <div className="space-y-4 px-1">
        {/* Warning Messages */}
        <div className="flex items-start gap-3 rounded-md border border-destructive/50 bg-destructive/5 p-3 text-destructive">
          <AlertTriangle className="size-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <p>
              确定要永久删除品牌{" "}
              <span className="font-semibold">[{brand?.name ?? "此品牌"}]</span>{" "}
              吗?
            </p>
            <p className="font-semibold">
              请确保该品牌下已无关联的手机型号，否则无法删除。
            </p>
          </div>
        </div>
        {/* Action Buttons */}
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
