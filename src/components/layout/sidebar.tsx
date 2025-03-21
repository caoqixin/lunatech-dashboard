"use client";

import { usePathname } from "next/navigation";
import { memo, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Navigation } from "./navigation";

// 使用React.memo优化组件
export const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();

  // 使用useMemo缓存当前路径，避免不必要的重新计算
  const currentPath = useMemo(() => {
    return pathname.split("/").slice(0, 3).join("/");
  }, [pathname]);

  return (
    <div className="flex h-full flex-col border-r">
      <div className="flex h-14 items-center border-b px-4">
        <span className="font-semibold">Luna Tech</span>
      </div>
      <ScrollArea className="flex-1 px-2">
        <Navigation currentPath={currentPath} />
      </ScrollArea>
    </div>
  );
});
