import { Skeleton } from "./skeleton"; // 确保导入路径正确
import { cn } from "@/lib/utils"; // 引入 cn

interface SkeletonWrapperProps {
  count?: number;
  className?: string;
  variant?: "card" | "table-row" | "line" | "avatar" | "title"; // 添加更多变体
  wrapperClassName?: string; // 允许自定义 wrapper 的类
}

export function SkeletonWrapper({
  count = 3,
  className = "",
  variant = "line",
  wrapperClassName = "space-y-2", // 默认使用 space-y-2
}: SkeletonWrapperProps) {
  // 定义不同变体的默认样式
  const variants = {
    "table-row": "h-10 w-full", // 表格行
    card: "h-[180px] w-full rounded-lg", // 卡片
    line: "h-4 w-full rounded", // 普通行，添加圆角
    avatar: "h-10 w-10 rounded-full", // 头像
    title: "h-6 w-3/4 rounded", // 标题行
  };

  // 获取当前变体的样式
  const variantClass = variants[variant] || variants.line; // 默认为 line

  return (
    // 使用 cn 合并 wrapperClassName
    <div className={cn(wrapperClassName)}>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className={cn(variantClass, className)} /> // 使用 cn 合并基础变体样式和传入的 className
        ))}
    </div>
  );
}
