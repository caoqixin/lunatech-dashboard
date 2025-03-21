"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Navigation } from "./navigation";

// 使用memo优化组件
export const MobileNavigation = memo(function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // 关闭侧边栏的函数
  const handleClose = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">打开菜单</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex h-14 items-center border-b px-6">
          <span className="font-semibold">Luna Tech</span>
        </div>
        <div className="px-2">
          <Navigation
            currentPath={pathname.split("/").slice(0, 3).join("/")}
            variant="mobile"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
});
