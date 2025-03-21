"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "@/lib/constants"; // 需创建此常量文件

interface NavigationProps {
  currentPath: string;
  variant?: "desktop" | "mobile";
}

// 提取导航项组件
const NavigationItem = memo(function NavigationItem({
  item,
  isActive,
  variant = "desktop",
}: {
  item: (typeof NAVIGATION_ITEMS)[0];
  isActive: boolean;
  variant: "desktop" | "mobile";
}) {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2",
        isActive && "bg-muted",
        variant === "mobile" && "text-lg p-6"
      )}
    >
      <Link href={item.href} target={item.target ?? "_self"}>
        {item.icon && <item.icon className="h-5 w-5" />}
        {item.label}
      </Link>
    </Button>
  );
});

// 使用memo优化组件
export const Navigation = memo(function Navigation({
  currentPath,
  variant = "desktop",
}: NavigationProps) {
  // 使用useMemo缓存导航项列表
  const navigationItems = useMemo(() => {
    return NAVIGATION_ITEMS.map((item) => ({
      ...item,
      isActive: item.href === currentPath,
    }));
  }, [currentPath]);

  return (
    <nav className="space-y-1 py-4">
      {navigationItems.map((item) => (
        <NavigationItem
          key={item.href}
          item={item}
          isActive={item.isActive}
          variant={variant}
        />
      ))}
    </nav>
  );
});
