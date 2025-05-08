"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "@/lib/constants";

interface NavigationProps {
  currentPath: string; // 路径用于高亮
  variant?: "desktop" | "mobile"; // 添加 variant 类型
}

// 单个导航项组件
const NavigationItem = memo(function NavigationItem({
  item,
  isActive,
  variant = "desktop",
}: {
  item: (typeof NAVIGATION_ITEMS)[0];
  isActive: boolean;
  variant?: "desktop" | "mobile"; // 添加 variant 类型
}) {
  return (
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"} // 激活时使用 secondary 变体，更明显
      className={cn(
        "w-full justify-start gap-2.5 h-10", // 统一高度，调整 gap
        // 移动端样式可以按需调整，例如增加 padding 或字体大小
        variant === "mobile" ? "text-base px-4" : "text-sm px-3"
      )}
      aria-current={isActive ? "page" : undefined} // 增强可访问性
    >
      <Link href={item.href} target={item.target ?? "_self"}>
        {item.icon && <item.icon className="h-4 w-4" />}{" "}
        {/* 图标尺寸 h-4 w-4 */}
        <span>{item.label}</span> {/* 包裹 label */}
      </Link>
    </Button>
  );
});

// 导航列表组件
export const Navigation = memo(function Navigation({
  currentPath,
  variant = "desktop",
}: NavigationProps) {
  // 使用 useMemo 缓存计算结果
  const navigationLinks = useMemo(() => {
    return NAVIGATION_ITEMS.map((item) => (
      <NavigationItem
        key={item.href}
        item={item}
        // 高亮逻辑：精确匹配或对于 /dashboard 特殊处理
        isActive={
          currentPath === item.href ||
          (item.href === "/dashboard" && currentPath === "/dashboard")
        }
        variant={variant}
      />
    ));
    // 依赖 currentPath 和 variant
  }, [currentPath, variant]);

  return (
    // 调整间距为 space-y-1
    <nav className="grid items-start gap-1">{navigationLinks}</nav>
  );
});
