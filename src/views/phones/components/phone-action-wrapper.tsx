"use client";

import { Phone } from "@/lib/types";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useState } from "react";
import { EditPhone } from "@/views/phones/components/edit-phone";
import { DeletePhone } from "@/views/phones/components/delete-phone";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { MoreVertical, Pencil, Trash } from "lucide-react";

interface PhoneActionWrapperProps {
  phone: Phone;
}

type Content = "edit" | "delete";

export const PhoneActionWrapper = ({ phone }: PhoneActionWrapperProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const [activeContent, setActiveContent] = useState<Content | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleClose = () => {
    setDrawerOpen(false);
  };

  if (isDesktop) {
    return (
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <EditPhone phone={phone} />
          <DeletePhone phone={phone} />
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
              <EditPhone
                phone={phone}
                isDropDownMenu={true}
                onCancel={() => handleClose()}
              />
            )}
            {activeContent === "delete" && (
              <DeletePhone
                phone={phone}
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

export default PhoneActionWrapper;
