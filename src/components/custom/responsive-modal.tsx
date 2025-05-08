"use client";
import { useMedia } from "react-use";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
  /**
   * 触发器按钮或元素
   */
  triggerButton: React.ReactNode;
  /**
   * 模态框标题
   */
  title: string;
  /**
   * 模态框描述 (可选)
   */
  description?: string;
  /**
   * 模态框内容
   */
  children: React.ReactNode;
  /**
   * 控制模态框打开状态
   */
  open: boolean;
  /**
   * 打开状态变化时的回调函数
   */
  onOpenChange: (open: boolean) => void;
  /**
   * 对话框模式下的宽度 (Tailwind 类, e.g., 'sm:max-w-md', 'sm:max-w-lg') (可选)
   * 默认为 sm:max-w-[465px] (接近 sm:max-w-md)
   */
  dialogClassName?: string;
  /**
   * 控制是否在移动端 (Drawer) 显示默认的页脚（包含一个取消按钮）
   * @default true
   */
  showMobileFooter?: boolean;
}

export const ResponsiveModal = ({
  triggerButton,
  title,
  description,
  children,
  open,
  onOpenChange,
  dialogClassName = "sm:max-w-md",
  showMobileFooter = true,
}: ResponsiveModalProps) => {
  // 使用 useMedia 或其他 hook 检测屏幕尺寸，ssr 时默认为 true (桌面)
  const isDesktop = useMedia("(min-width: 768px)", true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        {/* 应用传入的 Tailwind 宽度类 */}
        <DialogContent className={cn("p-0", dialogClassName)}>
          {/* 将 Header 移到 Content 内部以应用圆角 */}
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {/* 内容区域添加内边距 */}
          <div className="px-6 pb-6">{children}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        {/* 内容区域添加内边距 */}
        <div className="px-4 pb-4">{children}</div>
        {/* --- 条件渲染 Footer --- */}
        {showMobileFooter && (
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">取消</Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
