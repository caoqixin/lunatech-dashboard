"use client";
import { EditCategoryItems } from "./edit-category-items";
import DeleteItem from "@/components/tables/table-component/delete-item";
import { useState, useTransition } from "react";
import { deleteCategoryItem } from "@/lib/actions/server/category_items";
import { useToast } from "@/components/ui/use-toast";

export default function CategoryItemsCellAction({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    startTransition(async () => {
      const res = await deleteCategoryItem(id, name);

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
      <EditCategoryItems id={id} name={name} />
      <DeleteItem
        name={name}
        title="分类"
        onDelete={handleDelete}
        open={open}
        setOpen={setOpen}
        pending={pending}
      />
    </div>
  );
}
