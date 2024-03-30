"use client";
import { EditCategory } from "./edit-category";
import { DeleteCategory } from "./delete-category";
import { Category } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const CategoryCellAction = (category: Category) => {
  const { toast } = useToast();
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const generate = () => {
    const url = `/api/v1/form/options/category_items/${category.id}`;
    copyToClipboard(url);
  };

  useEffect(() => {
    if (copiedText) {
      toast({
        title: `回调地址生成成功, ${copiedText} 请前往设置页面进行设置`,
      });
    }
  }, [copiedText]);
  return (
    <div className="flex items-center gap-3 justify-end">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={generate}
      >
        <MagicWandIcon className="w-4 h-4" /> 生成回调地址
      </Button>
      <EditCategory {...category} />
      <DeleteCategory {...category} />
    </div>
  );
};

export default CategoryCellAction;
