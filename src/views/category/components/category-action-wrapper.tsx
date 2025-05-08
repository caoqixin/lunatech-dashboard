"use client";

import { useMediaQuery } from "@uidotdev/usehooks";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { CategoryType } from "@/views/category/schema/category.schema";
import { EditCategory } from "@/views/category/components/edit-category";
import { DeleteCategory } from "@/views/category/components/delete-category";
import type { CategoryComponent } from "@/lib/types";
import { useRouter } from "next/navigation";

interface CategoryActionWrapperProps {
  category: CategoryComponent;
  type: CategoryType;
}

export const CategoryActionWrapper = ({
  category,
  type,
}: CategoryActionWrapperProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  // Define the success callback
  const handleSuccess = () => {
    router.refresh();
  };

  // --- 桌面端视图 ---
  if (isDesktop) {
    return (
      <div className="flex items-center justify-end space-x-1.5">
        {" "}
        {/* 使用 space-x */}
        <EditCategory
          category={category}
          type={type}
          onSuccess={handleSuccess} // Pass callback
          triggerButton={
            // 使用小尺寸的图标按钮
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
        <DeleteCategory
          category={category}
          type={type}
          onSuccess={handleSuccess} // Pass callback
          triggerButton={
            // 使用小尺寸的图标按钮
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

  // --- 移动端视图 (Dropdown Menu containing triggers) ---
  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* 触发器按钮 */}
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
          {/* 编辑选项: DropdownMenuItem wraps the EditCategory trigger */}
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()} // Prevent default close behavior
            className="p-0 cursor-pointer" // Remove default padding
          >
            {/* EditCategory now handles its own modal/drawer via its trigger */}
            <EditCategory
              category={category}
              type={type}
              onSuccess={handleSuccess}
              triggerButton={
                // This button is the actual trigger passed to ResponsiveModal inside EditCategory
                <div className="flex items-center w-full px-2 py-1.5 text-sm">
                  <Pencil className="mr-2 size-4" />
                  编辑
                </div>
              }
            />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* 删除选项: DropdownMenuItem wraps the DeleteCategory trigger */}
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()} // Prevent default close behavior
            className="p-0 cursor-pointer" // Remove default padding
          >
            {/* DeleteCategory handles its own modal/drawer via its trigger */}
            <DeleteCategory
              category={category}
              type={type}
              onSuccess={handleSuccess}
              triggerButton={
                // This button is the actual trigger passed to ResponsiveModal inside DeleteCategory
                <div className="flex items-center w-full px-2 py-1.5 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <Trash className="mr-2 size-4" />
                  删除
                </div>
              }
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CategoryActionWrapper;
