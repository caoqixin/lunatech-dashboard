import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";

export const metadata: Metadata = {
  title: {
    template: "%s | Luna Tech - 后台", // 更新模板标题
    default: "Luna Tech - 后台管理", // 更新默认标题
  },
  description: "Luna Tech 手机维修店后台管理系统", // 更新描述
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* --- 侧边栏 --- */}
      {/* 固定定位，仅在大屏幕显示 (lg and up) */}
      {/* 使用 w-64 (256px) 或保持 w-[264px]，确保下面 pl 值匹配 */}
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-64 flex-col border-r bg-background lg:flex">
        <Suspense
          fallback={
            // 更精细的 Sidebar 骨架屏
            <div className="flex h-full flex-col">
              {/* Logo/Title Skeleton */}
              <div className="flex h-14 items-center border-b px-4">
                <Skeleton className="h-6 w-24" />
              </div>
              {/* Nav Links Skeleton */}
              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full" />
                ))}
              </div>
            </div>
          }
        >
          <Sidebar />
        </Suspense>
      </aside>

      {/* --- 主内容区域容器 --- */}
      {/* 使用 flex-1 占据剩余空间 */}
      {/* 在大屏幕上添加左内边距以避开固定侧边栏 */}
      {/* 移除 transition，因为侧边栏宽度是固定的 */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* 顶部导航栏 */}
        {/* Z-index 低于侧边栏，高于内容 */}
        <header className="sticky top-0 z-20">
          <Navbar showBackButton={false} />
        </header>

        {/* 主要内容区域 */}
        {/* 使用 p-6 或 p-8 提供边距，保持一致 */}
        {/* flex-1 使其填充剩余垂直空间 */}
        <main className="flex-1 overflow-y-auto p-2">
          {/* 限制内容最大宽度并居中 */}
          <div className="mx-auto max-w-screen-2xl">
            {/* 这里渲染页面具体内容或 loading/error 状态 */}
            <Suspense fallback={<DashboardLoading />}>{children}</Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

// 定义 Loading 组件（如果需要独立的 Loading UI）
function DashboardLoading() {
  return (
    <div className="flex flex-1 items-center justify-center p-10">
      <Loader className="size-8 animate-spin text-primary" />
    </div>
  );
}
