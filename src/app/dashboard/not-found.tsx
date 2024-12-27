"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2>404 Not Found</h2>
      <Button onClick={() => router.back()} variant="default" size="lg">
        返回
      </Button>
    </div>
  );
}
