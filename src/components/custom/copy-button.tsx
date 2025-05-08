"use client";

import { useState, useCallback } from "react";
import { Button, type ButtonProps } from "@/components/ui/button"; // Adjust path
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Adjust path
import { Check, Copy } from "lucide-react"; // Import icons
import { cn } from "@/lib/utils"; // Adjust path
import { toast } from "sonner"; // Optional: Use toast for feedback

interface CopyButtonProps extends ButtonProps {
  /**
   * 需要复制的文本内容
   */
  valueToCopy: string;
  /**
   * 复制成功时显示的 Tooltip 文本 (可选)
   * @default "已复制!"
   */
  successTooltip?: string;
  /**
   * 默认状态下的 Tooltip 文本 (可选)
   * @default "点击复制"
   */
  defaultTooltip?: string;
  /**
   * 图标大小 (Tailwind size class, e.g., 'size-4') (可选)
   * @default "size-4"
   */
  iconSize?: string;
  /**
   * 成功状态显示的时长 (毫秒) (可选)
   * @default 1500
   */
  successDuration?: number;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  valueToCopy,
  successTooltip = "已复制!",
  defaultTooltip = "点击复制",
  variant = "ghost", // Default to ghost variant
  size = "icon", // Default to icon size
  className,
  iconSize = "size-4",
  successDuration = 1500,
  children, // Allow passing children to override icon maybe?
  ...props // Pass remaining ButtonProps
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(valueToCopy);
      setIsCopied(true);
      // Optional: Show toast notification
      // toast.success("已复制到剪贴板");

      // Reset icon after a delay
      setTimeout(() => {
        setIsCopied(false);
      }, successDuration);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("复制失败，请手动复制。"); // Show error toast
    }
  }, [valueToCopy, successDuration]);

  // Determine which icon to display
  const Icon = isCopied ? Check : Copy;
  const tooltipText = isCopied ? successTooltip : defaultTooltip;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip open={isCopied ? true : undefined}>
        {" "}
        {/* Keep tooltip open during success state */}
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={cn("relative", className)} // Add relative for potential icon positioning
            onClick={handleCopy}
            aria-label={tooltipText} // ARIA label for accessibility
            {...props} // Spread other button props
          >
            {/* Render children if provided, otherwise render icon */}
            {children ? (
              children
            ) : (
              <Icon
                className={cn(
                  iconSize,
                  isCopied && "text-green-600 dark:text-green-400"
                )}
              /> // Style success icon
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// 可选: 添加默认导出，如果这是你习惯的方式
// export default CopyButton;
