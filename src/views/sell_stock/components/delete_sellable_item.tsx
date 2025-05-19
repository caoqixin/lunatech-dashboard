"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader, Trash, AlertTriangle } from "lucide-react";
import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Button } from "@/components/ui/button";
import type { SellStock } from "@/lib/types";
import { deleteSellProduct } from "../api/sell_stock_admin";

interface DeleteSellableItemProps {
  item: SellStock;
  triggerButton: React.ReactNode;
  onSuccess?: () => void;
}

export const DeleteSellableItem = ({
  item,
  triggerButton,
  onSuccess,
}: DeleteSellableItemProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const title = `删除商品: ${item?.name ?? ""}`;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteSellProduct(item.id);
      if (result.status == "success") {
        toast.success(result.msg || "商品删除成功！");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(result.msg || "删除失败。");
      }
    } catch (error: any) {
      toast.error(`操作失败: ${error.message || "未知错误"}`);
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
      description="此操作不可逆，商品信息将被永久删除。"
      triggerButton={triggerButton}
      dialogClassName="sm:max-w-sm"
      showMobileFooter={false}
    >
      <div className="space-y-4 px-1">
        <div className="flex items-start gap-3 rounded-md border border-destructive/50 bg-destructive/5 p-3 text-destructive">
          <AlertTriangle className="size-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm ">
            确定要永久删除商品{" "}
            <span className="font-semibold">
              [{item?.name ?? "此商品"}] (ID: {item?.id})
            </span>{" "}
            吗?
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
