"use client";
import { Button } from "@/components/ui/button";
import { Pencil2Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useToast } from "@/components/ui/use-toast";
import DeleteItem from "@/components/tables/table-component/delete-item";
import {
  deleteComponent,
  getComponentById,
} from "@/lib/actions/server/repair_components";
import ViewItem from "@/components/tables/table-component/view-item";
import { ClientComponent } from "@/lib/definitions";

export default function ComponentCellAction(component: ClientComponent) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const handleDelete = async () => {
    startTransition(async () => {
      const res = await deleteComponent(component.id, component.name);

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
    const data = await getComponentById(component.id);

    return data;
  };
  return (
    <div className="flex items-center gap-3 justify-end">
      <ViewItem
        title="详情"
        label={`${component.name} 详情信息`}
        loadData={loadData}
        type="components"
      />
      <Button variant="secondary" className="flex items-center gap-2" asChild>
        <Link href={`/dashboard/components/${component.id}/edit`}>
          <Pencil2Icon className="w-4 h-4" /> 修改
        </Link>
      </Button>
      <DeleteItem
        name={component.name}
        title="维修配件"
        onDelete={handleDelete}
        open={open}
        setOpen={setOpen}
        pending={pending}
      />
    </div>
  );
}
