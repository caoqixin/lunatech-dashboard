"use client";

import { usePathname } from "next/navigation";
import { memo, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Navigation } from "./navigation";
import Link from "next/link"; // 引入 Link

export const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();

  // 提取当前用于高亮的路径
  const currentPath = useMemo(() => {
    // 匹配 /dashboard, /dashboard/orders, /dashboard/repairs 等
    // 返回前三段，例如 /dashboard/orders
    return pathname.split("/").slice(0, 3).join("/");
  }, [pathname]);

  return (
    // 移除多余的 border-r，因为父级 aside 已经有
    <div className="flex h-full flex-col">
      {/* 侧边栏头部 - Logo 或标题 */}
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="font-semibold text-lg text-primary">
          {" "}
          {/* 增加样式 */}
          Luna Tech
        </Link>
      </div>
      {/* 导航区域 - 使用 ScrollArea */}
      <ScrollArea className="flex-1">
        {/* 为导航添加垂直内边距 */}
        <div className="px-2 py-4">
          <Navigation currentPath={currentPath} variant="desktop" />
        </div>
      </ScrollArea>
      {/* 可选的侧边栏底部区域 */}
      {/* <div className="mt-auto border-t p-4">
        <p className="text-xs text-muted-foreground">© 2024 Luna Tech</p>
      </div> */}
    </div>
  );
});
