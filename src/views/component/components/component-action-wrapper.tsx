"use client";

import type { Component } from "@/lib/types";
import { ViewComponent } from "@/views/component/components/view-component";
import { DeleteComponent } from "@/views/component/components/delete-component";
import { EditComponent } from "@/views/component/components/edit-component";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreVertical, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

interface ComponentActionWrapperProps {
  component: Component;
}

export const ComponentActionWrapper = ({
  component,
}: ComponentActionWrapperProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh();
  };

  // --- Desktop View: Icon Buttons ---
  if (isDesktop) {
    return (
      <div className="flex items-center justify-end space-x-1">
        <ViewComponent
          component={component}
          triggerButton={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="查看详情"
            >
              {" "}
              <Eye className="size-4" />{" "}
            </Button>
          }
        />
        <EditComponent
          component={component}
          onSuccess={handleSuccess}
          triggerButton={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="编辑"
            >
              {" "}
              <Pencil className="size-4" />{" "}
            </Button>
          }
        />
        <DeleteComponent
          component={component}
          onSuccess={handleSuccess}
          triggerButton={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label="删除"
            >
              {" "}
              <Trash className="size-4" />{" "}
            </Button>
          }
        />
      </div>
    );
  }

  // --- Mobile View: Dropdown Menu ---
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
            <ViewComponent
              component={component}
              triggerButton={
                <div className="flex items-center w-full px-2 py-1.5 text-sm">
                  {" "}
                  <Eye className="mr-2 size-4" /> 查看详情{" "}
                </div>
              }
            />
          </DropdownMenuItem>
          {/* Edit Action */}
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="p-0 cursor-pointer"
          >
            <EditComponent
              component={component}
              onSuccess={handleSuccess}
              triggerButton={
                <div className="flex items-center w-full px-2 py-1.5 text-sm">
                  {" "}
                  <Pencil className="mr-2 size-4" /> 编辑{" "}
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
            <DeleteComponent
              component={component}
              onSuccess={handleSuccess}
              triggerButton={
                <div className="flex items-center w-full px-2 py-1.5 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive">
                  {" "}
                  <Trash className="mr-2 size-4" /> 删除{" "}
                </div>
              }
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ComponentActionWrapper;
