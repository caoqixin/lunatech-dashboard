"use client";

import type { RepairWithCustomer } from "@/lib/types";
import { ViewRepair } from "@/views/repair/components/view-repair";
import { EditRepair } from "@/views/repair/components/edit-repair";
import { DeleteRepair } from "@/views/repair/components/delete-repair";
import { Edit, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RepairActionWrapperProps {
  repair: RepairWithCustomer;
  onSuccess?: () => void;
}

export const RepairActionWrapper = ({
  repair,
  onSuccess,
}: RepairActionWrapperProps) => {
  return (
    // Use flex row for desktop-like layout, let ResponsiveModal handle actual view
    <div className="flex items-center justify-end gap-1">
      <ViewRepair
        repair={repair}
        triggerButton={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="查看详情"
          >
            <Eye className="size-4" />
          </Button>
        }
      />
      <EditRepair
        repair={repair}
        onSuccess={onSuccess} // Pass down callback
        triggerButton={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="编辑维修单"
          >
            <Edit className="size-4" />
          </Button>
        }
      />
      {/* Conditionally render Delete based on isRework */}
      {!repair.isRework && (
        <DeleteRepair
          repair={repair}
          onSuccess={onSuccess} // Pass down callback
          triggerButton={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label="删除维修单"
            >
              <Trash className="size-4" />
            </Button>
          }
        />
      )}
    </div>
  );
};
