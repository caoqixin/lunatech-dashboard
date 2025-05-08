"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { updateRepairStatus } from "@/views/repair/api/repair";
import {
  RepairStatus,
  RepairWarrantyStatus,
} from "@/views/repair/schema/repair.schema";
import { toast } from "sonner";
import { ChevronDown, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusBadgeStyle } from "./repair-status-badge";

interface TableSelectStatusProps {
  initialValue: unknown;
  isRework: boolean;
  id: number;
  onSuccess?: () => void;
}

export const TableSelectStatus = ({
  initialValue,
  isRework,
  id,
  onSuccess,
}: TableSelectStatusProps) => {
  // Define status options based on isRework FIRST
  const statusOptions = useMemo<Array<RepairStatus | RepairWarrantyStatus>>(
    () =>
      isRework
        ? Object.values(RepairWarrantyStatus)
        : Object.values(RepairStatus),
    [isRework]
  );

  const getValidInitialStatus = useCallback(
    (val: unknown): RepairStatus | RepairWarrantyStatus => {
      const stringVal = String(val);
      if (statusOptions.includes(stringVal as any)) {
        // Check if string is in the specific options array
        return val as RepairStatus | RepairWarrantyStatus;
      }
      return isRework ? RepairWarrantyStatus.REWORKING : RepairStatus.PENDING;
    },
    [isRework, statusOptions]
  );

  const [value, setValue] = useState(() => getValidInitialStatus(initialValue));
  const [isPending, startTransition] = useTransition();

  // Sync with external initialValue changes
  useEffect(() => {
    setValue(getValidInitialStatus(initialValue));
  }, [initialValue, getValidInitialStatus]);

  const handleSave = useCallback(
    async (newValue: RepairStatus | RepairWarrantyStatus) => {
      // No need for setIsEditing(false) here, onOpenChange handles closing
      if (newValue === value) return; // No change

      startTransition(async () => {
        try {
          const { msg, status } = await updateRepairStatus(id, newValue);
          if (status === "success") {
            setValue(newValue); // Update local state visually
            toast.success(msg);
            onSuccess?.();
          } else {
            toast.error(msg);
          }
        } catch (error) {
          console.error("更新状态失败:", error);
          toast.error("更新状态失败，请重试");
        }
      });
    },
    [id, value, onSuccess, startTransition] // Dependencies
  );

  // Get badge style based on the CURRENT validated state
  const badgeStyle = getStatusBadgeStyle(value);

  return (
    <div className="relative w-32">
      <Select
        value={value} // Controlled component
        onValueChange={(newValue) =>
          handleSave(newValue as RepairStatus | RepairWarrantyStatus)
        } // Cast newValue back
        disabled={isPending}
      >
        <SelectTrigger
          className={cn(
            "h-8 text-xs font-medium border-0 focus:ring-0 focus:ring-offset-0 data-[state=open]:ring-1 data-[state=open]:ring-ring", // Add ring on open for focus
            badgeStyle.className // Apply badge styling
          )}
          aria-label="更改维修状态"
        >
          {/* Display the current value (status string) */}
          <SelectValue />
          {/* Icons inside trigger */}
          {!isPending && (
            <ChevronDown className="ml-auto size-3.5 opacity-50 shrink-0" />
          )}
          {isPending && (
            <Loader className="ml-auto size-4 animate-spin shrink-0" />
          )}
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((status) => (
            <SelectItem key={status} value={status} className="text-xs">
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
