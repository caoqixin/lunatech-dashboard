"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FileQuestion } from "lucide-react"; // 使用图标增加视觉提示

export default function NotFound() {
  const router = useRouter();

  return (
    // 使用 flex-1 配合父布局 flex
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <FileQuestion className="size-16 mb-4 text-muted-foreground" />
      <h2 className="text-2xl font-semibold mb-2 text-foreground">
        页面未找到
      </h2>
      <p className="text-muted-foreground mb-6 max-w-xs">
        抱歉，我们找不到您要查找的页面。请检查链接或返回。
      </p>
      <Button onClick={() => router.back()} variant="outline" size="default">
        返回上一页
      </Button>
      {/* 或者提供一个返回仪表盘的按钮 */}
      <Button
        onClick={() => router.push("/dashboard")}
        variant="default"
        size="default"
        className="mt-2"
      >
        返回仪表盘
      </Button>
    </div>
  );
}
