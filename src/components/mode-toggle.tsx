"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { MoonIcon, SunIcon } from "lucide-react"; // 使用 lucide-react 保持一致性
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // 添加 Tooltip 提升可访问性

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  // 避免在 SSR 阶段渲染与客户端不一致的内容
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    // 可以在 SSR 时渲染一个占位符或 null
    return (
      <Button variant="outline" size="icon" disabled className="h-9 w-9" />
    ); // 保持尺寸一致
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentThemeLabel = theme === "dark" ? "暗色模式" : "亮色模式";

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost" // 改为 ghost，更融入 Navbar
            size="icon"
            onClick={toggleTheme}
            aria-label={`切换到${theme === "dark" ? "亮色" : "暗色"}模式`} // 添加 aria-label
          >
            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>切换至 {theme === "dark" ? "亮色" : "暗色"} 模式</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
