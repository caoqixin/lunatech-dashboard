"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Loader, Trash, AlertTriangle } from "lucide-react";
import { CategoryType } from "@/views/category/schema/category.schema";
import { ResponsiveModal } from "@/components/custom/responsive-modal";

import { deleteComponentCategory } from "@/views/category/api/component";
import { deleteProblem } from "@/views/category/api/problem";

import { Button } from "@/components/ui/button";
import type { CategoryComponent } from "@/lib/types";

interface DeleteCategoryProps {
  category: CategoryComponent;
  type: CategoryType;
  /**
   * 触发按钮 (现在由父组件提供)
   */
  triggerButton: React.ReactNode;
  /**
   * 删除成功后的回调 (可选)
   */
  onSuccess?: () => void;
}

export const DeleteCategory = ({
  category,
  type,
  triggerButton, // Use passed trigger
  onSuccess,
}: DeleteCategoryProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const title = `删除 ${category?.name ?? "分类"}`;

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const action =
        type === CategoryType.COMPONENT
          ? deleteComponentCategory
          : deleteProblem;
      const { msg, status } = await action(category.id);

      if (status === "success") {
        toast.success(msg);
        setOpen(false); // Close modal
        onSuccess?.(); // Call success callback
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error("删除失败，请稍后重试。");
      console.error("Delete category error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setIsDeleting(false); // Reset deleting state on close
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      triggerButton={triggerButton} // Use passed trigger
      title={title}
      description="此操作不可逆，请谨慎确认。" // Add description
      dialogClassName="sm:max-w-sm" // Limit width
      showMobileFooter={false}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-md border border-destructive/50 bg-destructive/5 p-3 text-destructive">
          <AlertTriangle className="size-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm ">
            确定要删除{" "}
            <span className="font-semibold">
              [{category?.name ?? "此分类"}]
            </span>{" "}
            吗? 与此分类相关的所有数据（如配件关联）可能也会受到影响。
          </p>
        </div>
        {/* 底部按钮 */}
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
