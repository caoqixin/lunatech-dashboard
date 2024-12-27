import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Loader, Trash } from "lucide-react";
import { CategoryType } from "@/views/category/schema/category.schema";
import { ResponsiveModal } from "@/components/custom/responsive-modal";

import { deleteComponentCategory } from "@/views/category/api/component";
import { deleteProblem } from "@/views/category/api/problem";

import { Button } from "@/components/ui/button";
import { CategoryComponent } from "@/lib/types";

interface DeleteCategoryProps {
  category: CategoryComponent;
  type: CategoryType;
  isDropDownMenu?: boolean;
  onCancel?: () => void;
}

export const DeleteCategory = ({
  category,
  type,
  isDropDownMenu = false,
  onCancel,
}: DeleteCategoryProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    if (type === CategoryType.COMPONENT) {
      const { msg, status } = await deleteComponentCategory(category.id);
      if (status == "success") {
        toast.success(msg);
        if (isDropDownMenu) {
          onCancel?.();
        } else {
          setOpen(false);
        }
        router.refresh();
      } else {
        toast.error(msg);
      }
    } else if (type === CategoryType.REPAIR) {
      const { msg, status } = await deleteProblem(category.id);
      if (status == "success") {
        toast.success(msg);
        if (isDropDownMenu) {
          onCancel?.();
        } else {
          setOpen(false);
        }
        router.refresh();
      } else {
        toast.error(msg);
      }
    }

    setIsDeleting(false);
  };

  if (isDropDownMenu) {
    return (
      <ResponsiveModal
        open={open}
        onOpen={setOpen}
        dropdownMenu={isDropDownMenu}
        triggerButton={
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
          >
            <Trash className="size-4" /> 删除
          </Button>
        }
        title={`删除${category.name}`}
      >
        <div className="flex flex-col space-y-4 mx-4">
          <p className="text-red-600">
            确定要删除 [{category.name}] 吗?, 该操作是不可逆, 慎重考虑 !!!
          </p>
          <Button
            variant="destructive"
            className="flex w-full gap-2 items-center"
            onClick={() => handleDelete()}
          >
            {isDeleting && <Loader className="animate-spin size-4" />}
            确定
          </Button>
        </div>
      </ResponsiveModal>
    );
  }

  return (
    <ResponsiveModal
      open={open}
      onOpen={setOpen}
      triggerButton={
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-2"
        >
          <Trash className="size-4" /> 删除
        </Button>
      }
      title={`删除${category.name}`}
    >
      <div className="flex flex-col space-y-4">
        <p className="text-red-600">
          确定要删除 [{category.name}] 吗?, 该操作是不可逆, 慎重考虑 !!!
        </p>
        <div className="flex w-full justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button
            variant="destructive"
            className="flex gap-2 items-center"
            onClick={() => handleDelete()}
          >
            {isDeleting && <Loader className="animate-spin size-4" />}
            确定
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  );
};
