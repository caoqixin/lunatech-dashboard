"use client";

import type { SellStock } from "@/lib/types";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { EditSellableItem } from "./edit_sellable_item";
import { DeleteSellableItem } from "./delete_sellable_item";

interface SellStockActionWrapperProps {
  item: SellStock;
  onSuccess?: () => void; // Pass success callback from parent (SellStockAdminPage via table)
}

export const SellStockActionWrapper = ({
  item,
  onSuccess,
}: SellStockActionWrapperProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // For "View" functionality, you can either create a ViewSellableItem component
  // or directly use a simple modal here if details are few.
  // For simplicity, we'll omit View action for now, assuming edit covers most needs for admin.

  if (isDesktop) {
    return (
      <div className="flex items-center justify-end space-x-1">
        {/* Optional View Button if needed */}
        {/* <ViewSellableItem item={item} triggerButton={<Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="size-4" /></Button>} /> */}
        <EditSellableItem
          item={item}
          onSuccess={onSuccess}
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
        <DeleteSellableItem
          item={item}
          onSuccess={onSuccess}
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

  // Mobile View
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
          {/* Optional View Item */}
          {/* <DropdownMenuItem onSelect={(e)=>e.preventDefault()} className="p-0 cursor-pointer">
             <ViewSellableItem item={item} triggerButton={<div className="flex items-center w-full px-2 py-1.5 text-sm"> <Eye className="mr-2 size-4"/> 查看 </div>}/>
          </DropdownMenuItem> */}
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="p-0 cursor-pointer"
          >
            <EditSellableItem
              item={item}
              onSuccess={onSuccess}
              triggerButton={
                <div className="flex items-center w-full px-2 py-1.5 text-sm">
                  <Pencil className="mr-2 size-4" /> 编辑
                </div>
              }
            />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="p-0 cursor-pointer"
          >
            <DeleteSellableItem
              item={item}
              onSuccess={onSuccess}
              triggerButton={
                <div className="flex items-center w-full px-2 py-1.5 text-sm text-destructive focus:text-destructive/10">
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
