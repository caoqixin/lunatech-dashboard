"use client";

import { Loader } from "lucide-react";

export default function DashboardLoading() {
  return (
    // 使用 flex-1 配合父布局的 flex，确保撑满可用空间
    <div className="h-screen flex flex-1 flex-col items-center justify-center">
      {/* 图标颜色使用 text-primary，尺寸可稍大些 */}
      <Loader className="size-8 animate-spin text-primary" />
      {/* 可以添加可选的加载文本 */}
      {/* <p className="mt-2 text-muted-foreground">加载中...</p> */}
    </div>
  );
}
