"use client";

import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ViewSupplier } from "@/views/supplier/components/view-supplier";
import { DeleteSupplier } from "@/views/supplier/components/delete-supplier";
import { EditSupplier } from "@/views/supplier/components/edit-supplier";

import { Button } from "@/components/ui/button";
import { Eye, MoreVertical, Pencil, Trash } from "lucide-react";
import type { Supplier } from "@/lib/types";
import { useRouter } from "next/navigation";

interface SupplierActionWrapperProps {
  supplier: Supplier;
}

export const SupplierActionWrapper = ({
  supplier,
}: SupplierActionWrapperProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  // Callback for actions
  const handleSuccess = () => {
    router.refresh();
  };

  if (isDesktop) {
    return (
      <div className="flex items-center justify-end space-x-1">
        {" "}
        {/* Reduced space */}
        <ViewSupplier
          supplier={supplier}
          triggerButton={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="查看"
            >
              <Eye className="size-4" />
            </Button>
          }
        />
        <EditSupplier
          supplier={supplier}
          onSuccess={handleSuccess}
          triggerButton={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="编辑"
            >
              <Pencil className="size-4" />
            </Button>
          }
        />
        <DeleteSupplier
          supplier={supplier}
          onSuccess={handleSuccess}
          triggerButton={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label="删除"
            >
              <Trash className="size-4" />
            </Button>
          }
        />
      </div>
    );
  }

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
          {/* View Action */}
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="p-0 cursor-pointer"
          >
            <ViewSupplier
              supplier={supplier}
              triggerButton={
                <div className="flex items-center w-full px-2 py-1.5 text-sm">
                  <Eye className="mr-2 size-4" /> 查看详情
                </div>
              }
            />
          </DropdownMenuItem>
          {/* Edit Action */}
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="p-0 cursor-pointer"
          >
            <EditSupplier
              supplier={supplier}
              onSuccess={handleSuccess}
              triggerButton={
                <div className="flex items-center w-full px-2 py-1.5 text-sm">
                  <Pencil className="mr-2 size-4" /> 编辑
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
            <DeleteSupplier
              supplier={supplier}
              onSuccess={handleSuccess}
              triggerButton={
                <div className="flex items-center w-full px-2 py-1.5 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <Trash className="mr-2 size-4" /> 删除
                </div>
              }
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SupplierActionWrapper;
