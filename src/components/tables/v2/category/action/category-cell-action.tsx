"use client";
import { EditCategory } from "./edit-category";
import { Button } from "@/components/ui/button";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState, useTransition } from "react";
import DeleteItem from "@/components/tables/table-component/delete-item";
import { deleteCategory } from "@/lib/actions/server/categories";

export default function CategoryCellAction({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const { toast } = useToast();
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const generate = () => {
    const url = `/api/v1/form/options/category_items/${id}`;
    copyToClipboard(url);
  };

  useEffect(() => {
    if (copiedText) {
      toast({
        title: `回调地址生成成功, ${copiedText} 请前往设置页面进行设置`,
      });
    }
  }, [copiedText]);
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const handleDelete = async () => {
    startTransition(async () => {
      const res = await deleteCategory(id, name);

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
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={generate}
      >
        <MagicWandIcon className="w-4 h-4" /> 生成回调地址
      </Button>
      <EditCategory id={id} name={name} />
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
