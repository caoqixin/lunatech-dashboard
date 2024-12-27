"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { updateRepairStatus } from "@/views/repair/api/repair";
import {
  RepairStatus,
  RepairWarrantyStatus,
} from "@/views/repair/schema/repair.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

  const handleChange = async (
    newValue: RepairStatus | RepairWarrantyStatus
  ) => {
    if (newValue !== value) {
      setValue(newValue);
      const { msg, status } = await updateRepairStatus(id, newValue);

      if (status === "success") {
        toast.success(msg);
        router.refresh();
      } else {
        toast.error(msg);
      }
    }

    setIsEditing(false);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return isEditing ? (
    <Select defaultValue={value as string} onValueChange={handleChange}>
      <SelectTrigger className="w-30">
        <SelectValue placeholder="选择状态" />
      </SelectTrigger>
      <SelectContent>
        {isRework
          ? Object.values(RepairWarrantyStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))
          : Object.values(RepairStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
      </SelectContent>
    </Select>
  ) : (
    <span className="font-extrabold" onClick={() => setIsEditing(true)}>
      {value as string}
    </span>
  );
};
