"use client";

import ResponsiveActionModal from "@/components/custom/responsive-action-modal";
import { Button } from "@/components/ui/button";
import { Brand } from "@/lib/types";
import { deleteBrand } from "@/views/brand/api/brand";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteBrandProps {
  brand: Brand;
  onCancel?: () => void;
}

export const DeleteBrand = ({ brand, onCancel }: DeleteBrandProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const { msg, status } = await deleteBrand(brand.id);
    if (status == "success") {
      toast.success(msg);
      onCancel?.();
      router.refresh();
    } else {
      toast.error(msg);
    }
    setIsDeleting(false);
  };
  return (
    <ResponsiveActionModal title={`删除品牌 ${brand.name}`}>
      <div className="flex flex-col space-y-4 mx-4">
        <p className="text-destructive">
          确定要删除品牌 [{brand.name}] 吗?, 该操作是不可逆, 慎重考虑 !!!
        </p>
        <p className="text-destructive font-bold text-sm">
          请确保该品牌下没有手机型号, 如果有手机型号不可删除 !!!
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
    </ResponsiveActionModal>
  );
};
