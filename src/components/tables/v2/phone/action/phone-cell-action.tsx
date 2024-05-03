"use client";
import { Phone } from "@prisma/client";
import { EditPhone } from "./edit-phone";
import { useToast } from "@/components/ui/use-toast";
import { useState, useTransition } from "react";
import { deletePhone } from "@/lib/actions/server/phones";
import DeleteItem from "@/components/tables/table-component/delete-item";

export default function PhoneCellAction(phone: Phone) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const handleDelete = async () => {
    startTransition(async () => {
      const res = await deletePhone(phone.id, phone.name);

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
      <EditPhone {...phone} />
      <DeleteItem
        name={phone.name}
        title="手机型号"
        onDelete={handleDelete}
        open={open}
        setOpen={setOpen}
        pending={pending}
      />
    </div>
  );
}
