"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface SellStockErrorPageProps {
  error: string;
}

const SellStockErrorPage = ({ error }: SellStockErrorPageProps) => {
  const router = useRouter();
  return (
    // Show error only if not actively loading
    <Alert variant="destructive" className="mt-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>加载错误</AlertTitle>
      <AlertDescription>
        {error}
        <Button
          variant="link"
          size="sm"
          onClick={() => router.refresh()}
          className="p-0 h-auto ml-2"
        >
          点击重试
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default SellStockErrorPage;
