import { EditBrand } from "./edit-brand";
import { Brand } from "@prisma/client";
import DeleteItem from "@/components/tables/table-component/delete-item";
import { useToast } from "@/components/ui/use-toast";
import { useState, useTransition } from "react";
import { deleteBrand } from "@/lib/actions/server/brands";

export default function BrandCellAction(brand: Brand) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const handleDelete = async () => {
    startTransition(async () => {
      const res = await deleteBrand(brand.id);

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
      <EditBrand {...brand} />
      <DeleteItem
        name={brand.name}
        title="手机品牌"
        onDelete={handleDelete}
        open={open}
        setOpen={setOpen}
        pending={pending}
      />
    </div>
  );
}
