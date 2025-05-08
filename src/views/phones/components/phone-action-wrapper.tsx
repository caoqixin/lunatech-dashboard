"use client";

import type { Phone } from "@/lib/types";
import { useMediaQuery } from "@uidotdev/usehooks";
import { EditPhone } from "@/views/phones/components/edit-phone";
import { DeletePhone } from "@/views/phones/components/delete-phone";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

interface PhoneActionWrapperProps {
  phone: Phone;
}

export const PhoneActionWrapper = ({ phone }: PhoneActionWrapperProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh();
  };

  // --- Desktop View ---
  if (isDesktop) {
    return (
      <div className="flex items-center justify-end space-x-1">
        <EditPhone
          phone={phone}
          onSuccess={handleSuccess}
          triggerButton={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="编辑型号"
            >
              <Pencil className="size-4" />
            </Button>
          }
        />
        <DeletePhone
          phone={phone}
          onSuccess={handleSuccess}
          triggerButton={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label="删除型号"
            >
              <Trash className="size-4" />
            </Button>
          }
        />
      </div>
    );
  }

  // --- Mobile View ---
  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="更多操作"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* Edit Action */}
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="p-0 cursor-pointer"
          >
            <EditPhone
              phone={phone}
              onSuccess={handleSuccess}
              triggerButton={
                <div className="flex items-center w-full px-2 py-1.5 text-sm">
                  {" "}
                  <Pencil className="mr-2 size-4" /> 编辑型号{" "}
                </div>
              }
            />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* Delete Action */}
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="p-0 cursor-pointer"
          >
            <DeletePhone
              phone={phone}
              onSuccess={handleSuccess}
              triggerButton={
                <div className="flex items-center w-full px-2 py-1.5 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive">
                  {" "}
                  <Trash className="mr-2 size-4" /> 删除型号{" "}
                </div>
              }
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PhoneActionWrapper;
