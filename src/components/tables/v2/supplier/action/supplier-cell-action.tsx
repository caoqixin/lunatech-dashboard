"use client";
import EditSupplier from "./edit-supplier";
import ViewInfo from "./view-info";
import { Supplier } from "@prisma/client";
import DeleteItem from "@/components/tables/table-component/delete-item";
import { useState, useTransition } from "react";
import { useToast } from "@/components/ui/use-toast";
import { deleteSupplier } from "@/lib/actions/server/suppliers";

export default function SupplierCellAction(supplier: Supplier) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const handleDelete = async () => {
    startTransition(async () => {
      const res = await deleteSupplier(supplier.id, supplier.name);

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
  return (
    <div className="flex items-center gap-3 justify-end">
      <ViewInfo {...supplier} />
      <EditSupplier {...supplier} />
      <DeleteItem
        name={supplier.name}
        title="供应商"
        onDelete={handleDelete}
        open={open}
        setOpen={setOpen}
        pending={pending}
      />
    </div>
  );
}
