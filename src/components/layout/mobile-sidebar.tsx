"use client";

import { memo, useState, useEffect } from "react"; // 引入 useEffect
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react"; // 加入 X 图标用于关闭
import { usePathname } from "next/navigation";
import { Navigation } from "./navigation";
import Link from "next/link"; // 引入 Link

export const MobileNavigation = memo(function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // 当路由改变时，自动关闭侧边栏
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 使用当前路径进行导航高亮
  const currentPath = pathname.split("/").slice(0, 3).join("/");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="打开菜单">
          <Menu className="h-5 w-5" /> {/* 尺寸改为 h-5 w-5 */}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-64 flex-col p-0">
        {" "}
        {/* 固定宽度 */}
        {/* 侧边栏头部 */}
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Link
            href="/dashboard"
            className="font-semibold"
            onClick={() => setOpen(false)}
          >
            {" "}
            {/* 点击 Logo 关闭 */}
            Luna Tech
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            aria-label="关闭菜单"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        {/* 导航区域 */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          {" "}
          {/* 添加 py-4 */}
          <Navigation
            currentPath={currentPath}
            variant="mobile" // 传递 mobile 变体
          />
        </div>
      </SheetContent>
    </Sheet>
  );
});
