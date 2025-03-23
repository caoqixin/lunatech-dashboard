"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <h2 className="text-2xl font-bold mb-2">页面未找到</h2>
      <p className="text-gray-500 mb-4">您请求的资源不存在或已被移除</p>
      <Button onClick={() => router.back()} variant="default" size="lg">
        返回仪表盘
      </Button>
    </div>
  );
}
