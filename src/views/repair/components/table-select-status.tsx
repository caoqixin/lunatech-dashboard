"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import { updateRepairStatus } from "@/views/repair/api/repair";
import {
  RepairStatus,
  RepairWarrantyStatus,
} from "@/views/repair/schema/repair.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

interface TableSelectStatusProps {
  initialValue: unknown;
  isRework: boolean;
  id: number;
}

export const TableSelectStatus = ({
  initialValue,
  isRework,
  id,
}: TableSelectStatusProps) => {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    async (newValue: RepairStatus | RepairWarrantyStatus) => {
      if (newValue === value) {
        setIsEditing(false);
        return;
      }
      setIsSubmitting(true);

      try {
        const { msg, status } = await updateRepairStatus(id, newValue);
        if (status === "success") {
          setValue(newValue);
          toast.success(msg);
        } else {
          toast.error(msg);
        }
      } catch (error) {
        console.error("更新状态失败:", error);
        toast.error("更新状态失败，请重试");
      } finally {
        setIsSubmitting(false);
        setIsEditing(false);
      }
    },
    [id, value]
  );

  // 使用 useEffect 同步外部值变化
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // 优化状态选项的渲染
  const statusOptions = isRework
    ? Object.values(RepairWarrantyStatus)
    : Object.values(RepairStatus);

  return isEditing ? (
    <div className="relative">
      <Select
        defaultValue={value as string}
        onValueChange={handleChange}
        disabled={isSubmitting}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="选择状态" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isSubmitting && (
        <div className="absolute right-8 top-2">
          <Loader className="size-4 animate-spin" />
        </div>
      )}
    </div>
  ) : (
    <span
      className="font-extrabold cursor-pointer hover:underline"
      onClick={() => !isSubmitting && setIsEditing(true)}
    >
      {value as string}
    </span>
  );
};
