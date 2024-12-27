"use client";

import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

import { ViewSupplier } from "@/views/supplier/components/view-supplier";
import { DeleteSupplier } from "@/views/supplier/components/delete-supplier";
import { EditSupplier } from "@/views/supplier/components/edit-supplier";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { Eye, MoreVertical, Pencil, Trash } from "lucide-react";
import { Supplier } from "@/lib/types";

interface SupplierActionWrapperProps {
  supplier: Supplier;
}

type Content = "view" | "edit" | "delete";

export const SupplierActionWrapper = ({
  supplier,
}: SupplierActionWrapperProps) => {
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
          <ViewSupplier supplier={supplier} />
          <EditSupplier supplier={supplier} />
          <DeleteSupplier supplier={supplier} />
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
                  setActiveContent("view");
                }}
                className="flex items-start gap-2 cursor-pointer"
              >
                <Eye className="size-4" />
                查看
              </DropdownMenuItem>
            </DrawerTrigger>
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
            {activeContent === "view" && (
              <ViewSupplier supplier={supplier} isDropDownMenu={true} />
            )}
            {activeContent === "edit" && (
              <EditSupplier
                supplier={supplier}
                isDropDownMenu={true}
                onCancel={() => handleClose()}
              />
            )}
            {activeContent === "delete" && (
              <DeleteSupplier
                supplier={supplier}
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

export default SupplierActionWrapper;
