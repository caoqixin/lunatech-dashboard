"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil2Icon } from "@radix-ui/react-icons";
import ViewItem from "@/components/tables/table-component/view-item";
import {
  deleteRepair,
  getRepairWithCustomerById,
} from "@/lib/actions/server/repairs";
import { useToast } from "@/components/ui/use-toast";
import { useState, useTransition } from "react";
import DeleteItem from "@/components/tables/table-component/delete-item";
import { ClientRepiar } from "@/lib/definitions";

export default function RepairCellAction(repair: ClientRepiar) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const handleDelete = async () => {
    startTransition(async () => {
      const res = await deleteRepair(repair.id, repair.phone);

      if (res.status === "success") {
        toast({
          title: res.msg,
        });
        setOpen(false);
      } else {
        toast({
          title: res.msg,
          variant: "destructive",
        });
      }
    });
  };
  const loadData = async () => {
    const data = await getRepairWithCustomerById(repair.id);

    return data;
  };
  return (
    <div className="flex items-center gap-3 justify-end">
      <ViewItem
        title="查看"
        label={`${repair.phone} 维修详情`}
        loadData={loadData}
        type="repairs"
      />
      <Button variant="secondary" className="flex items-center gap-2" asChild>
        <Link href={`/dashboard/repairs/${repair.id}/edit`}>
          <Pencil2Icon className="w-4 h-4" /> 修改
        </Link>
      </Button>

      {!repair.isRework && (
        <DeleteItem
          name={repair.phone}
          title="手机维修"
          onDelete={handleDelete}
          open={open}
          setOpen={setOpen}
          pending={pending}
        />
      )}
    </div>
  );
}
