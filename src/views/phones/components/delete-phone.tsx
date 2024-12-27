import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Loader, Trash } from "lucide-react";
import { ResponsiveModal } from "@/components/custom/responsive-modal";

import { Button } from "@/components/ui/button";
import { Phone } from "@/lib/types";
import { deletePhone } from "@/views/phones/api/phone";

interface DeletePhoneProps {
  phone: Phone;
  isDropDownMenu?: boolean;
  onCancel?: () => void;
}

export const DeletePhone = ({
  phone,
  isDropDownMenu = false,
  onCancel,
}: DeletePhoneProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    const { msg, status } = await deletePhone(phone.id);
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
        title={`删除手机型号 ${phone.name}`}
      >
        <div className="flex flex-col space-y-4 mx-4">
          <p className="text-red-600">
            确定要删除 [{phone.name}] 吗?, 该操作是不可逆, 慎重考虑 !!!
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
      title={`删除${phone.name}`}
    >
      <div className="flex flex-col space-y-4">
        <p className="text-red-600">
          确定要删除 [{phone.name}] 吗?, 该操作是不可逆, 慎重考虑 !!!
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
