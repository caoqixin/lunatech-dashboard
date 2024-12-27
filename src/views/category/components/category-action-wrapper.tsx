"use client";

import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { CategoryType } from "@/views/category/schema/category.schema";
import { EditCategory } from "@/views/category/components/edit-category";
import { DeleteCategory } from "@/views/category/components/delete-category";
import { CategoryComponent } from "@/lib/types";

interface CategoryActionWrapperProps {
  category: CategoryComponent;
  type: CategoryType;
}

type Content = "edit" | "delete";

export const CategoryActionWrapper = ({
  category,
  type,
}: CategoryActionWrapperProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeContent, setActiveContent] = useState<Content | null>(null);

  const handleClose = () => {
    setDrawerOpen(false);
  };

  if (isDesktop) {
    return (
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <EditCategory category={category} type={type} />
          <DeleteCategory category={category} type={type} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end">
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DrawerTrigger asChild>
              <DropdownMenuItem
                onSelect={() => {
                  setActiveContent("edit");
                }}
                className="flex items-start gap-2 cursor-pointer"
              >
                <Pencil className="size-4" />
                修改
              </DropdownMenuItem>
            </DrawerTrigger>
            <DrawerTrigger asChild>
              <DropdownMenuItem
                onSelect={() => {
                  setActiveContent("delete");
                }}
                className="flex items-start gap-2 cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive"
              >
                <Trash className="size-4" />
                删除
              </DropdownMenuItem>
            </DrawerTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        {drawerOpen && (
          <div>
            {activeContent === "edit" && (
              <EditCategory
                category={category}
                type={type}
                isDropDownMenu={true}
                onCancel={() => handleClose()}
              />
            )}
            {activeContent === "delete" && (
              <DeleteCategory
                category={category}
                type={type}
                isDropDownMenu={true}
                onCancel={() => handleClose()}
              />
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default CategoryActionWrapper;
