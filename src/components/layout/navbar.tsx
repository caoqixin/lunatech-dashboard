"use client";

import React, { useState, useEffect, memo, Fragment } from "react"; // 引入 Fragment
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MobileNavigation } from "./mobile-sidebar";
import { UserButton } from "@/components/custom/user-button"; // 假设这是用户头像/菜单组件
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../mode-toggle";
import { ArrowLeft } from "lucide-react"; // 用于返回按钮
import { cn } from "@/lib/utils";

interface NavbarProps {
  showBackButton?: boolean;
  titleButton?: React.ReactNode; // 可以接受一个自定义节点作为标题区域
  customComponents?: React.ReactNode;
}

export const Navbar = memo(function Navbar({
  showBackButton = false, // 默认不显示返回按钮
  titleButton,
  customComponents,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // 判断是否在 dashboard 的根路径下，以此决定是否显示 MobileNavigation 触发器
  // 假设 dashboard 路径总是以 /dashboard 开头
  const isInsideDashboard = pathname.startsWith("/dashboard");

  useEffect(() => {
    const handleScroll = () => {
      // 优化：仅在滚动超过一定阈值（如5px）时设置状态
      setScrolled(window.scrollY > 5);
    };

    window.addEventListener("scroll", handleScroll, { passive: true }); // 使用 passive listener 提高性能
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 渲染左侧内容
  const renderLeftContent = () => {
    if (isInsideDashboard) {
      return (
        <Fragment>
          {/* 移动端导航触发器，仅在 Dashboard 内且为小屏幕时显示 */}
          <div className="lg:hidden">
            <MobileNavigation />
          </div>
          {/* 如果需要，在 Dashboard 内显示面包屑导航或页面标题 */}
          {/* <Breadcrumbs /> 或 <PageTitle /> */}
        </Fragment>
      );
    } else if (showBackButton) {
      // 如果明确要求显示返回按钮 (例如在非 dashboard 页面)
      return (
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard" aria-label="返回仪表盘">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
      );
    } else if (titleButton) {
      // 如果传入了自定义 title 节点
      return titleButton;
    }
    return null; // 默认情况，左侧为空
  };

  return (
    // 基础样式：高度、内边距、flex 布局
    // 滚动时添加背景模糊和细微阴影
    // 使用 bg-background/80 或 90 控制透明度
    <div
      className={cn(
        "flex h-14 items-center justify-between border-b px-4 lg:px-6", // 统一使用 px-4/lg:px-6
        "sticky top-0 z-20 transition-shadow duration-200", // z-index 低于 sidebar
        scrolled
          ? "border-b bg-background/90 shadow-sm backdrop-blur-md" // 滚动时样式
          : "border-transparent" // 未滚动时边框透明
      )}
    >
      {/* 左侧内容区域：移动端菜单触发器、面包屑或返回按钮 */}
      <div className="flex items-center gap-2">{renderLeftContent()}</div>

      {/* 右侧内容区域：主题切换、用户菜单 */}
      <div className="flex items-center gap-2">
        {customComponents}
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  );
});
