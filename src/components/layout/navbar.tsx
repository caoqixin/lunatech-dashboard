"use client";

import { useState, useEffect, memo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MobileNavigation } from "./mobile-sidebar";
import { UserButton } from "@/components/custom/user-button";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../mode-toggle";

interface NavbarProps {
  showBackButton?: boolean;
  titleButton?: React.ReactNode;
}

// 使用memo优化组件
export const Navbar = memo(function Navbar({
  showBackButton,
  titleButton,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // 检测当前页面是否为根路径
  const isRootPage = pathname === "/";

  // 监听滚动事件，添加导航栏阴影
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky border-b top-0 z-10 flex h-14 items-center justify-between px-6 transition-all ${
        scrolled ? "shadow-sm bg-background/95 backdrop-blur-sm" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {!isRootPage && (
          <div className="block lg:hidden">
            <MobileNavigation />
          </div>
        )}

        {/* 显示返回按钮或自定义titleButton */}
        {(showBackButton || isRootPage) &&
          (titleButton || (
            <Button asChild>
              <Link href="/dashboard">返回主页</Link>
            </Button>
          ))}
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  );
});
