"use client";

import { RepairWithCustomer } from "@/lib/types";
import { ViewRepair } from "@/views/repair/components/view-repair";
import { EditRepair } from "@/views/repair/components/edit-repair";
import { DeleteRepair } from "@/views/repair/components/delete-repair";

interface RepairActionWrapperProps {
  repair: RepairWithCustomer;
}

export const RepairActionWrapper = ({ repair }: RepairActionWrapperProps) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <ViewRepair repair={repair} />
      <EditRepair repair={repair} />
      {!repair.isRework && <DeleteRepair repair={repair} />}
    </div>
  );
};
