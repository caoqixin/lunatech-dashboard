"use client";

import { RepairWithCustomer } from "@/lib/types";
import { ViewRepair } from "@/views/repair/components/view-repair";
import { EditRepair } from "@/views/repair/components/edit-repair";
import { DeleteRepair } from "@/views/repair/components/delete-repair";
import { Card } from "@/components/ui/card";

interface RepairActionWrapperProps {
  repair: RepairWithCustomer;
}

export const RepairActionWrapper = ({ repair }: RepairActionWrapperProps) => {
  return (
    <Card className="flex items-center justify-end gap-2 p-1 rounded-lg shadow-sm w-fit">
      <ViewRepair repair={repair} />
      <EditRepair repair={repair} />
      {!repair.isRework && <DeleteRepair repair={repair} />}
    </Card>
  );
};
