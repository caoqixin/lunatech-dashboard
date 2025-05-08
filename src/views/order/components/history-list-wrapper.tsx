import { HistoryTable } from "./history-table";
import { countOrders, fetchOrderHistories } from "../api/history";
import type { OrderSearch as OrderSearchType } from "@/views/order/schema/order.schema";
import type { Order } from "@/lib/types";
import { useState, useEffect, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistoryListWrapperProps {
  searchParams: OrderSearchType;
}

export function HistoryListWrapper({ searchParams }: HistoryListWrapperProps) {
  const [data, setData] = useState<Order[]>([]);
  const [count, setCount] = useState(0); // Total row count
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async (currentParams: OrderSearchType) => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedData, fetchedCount] = await Promise.all([
        fetchOrderHistories(currentParams),
        // Ensure countOrders receives params needed for accurate count
        countOrders(currentParams.per_page),
      ]);
      setData(fetchedData ?? []);
      setCount(fetchedCount ?? 0); // Set total ROW count
    } catch (err: any) {
      console.error("Failed to load order history:", err);
      setError("无法加载历史记录。");
      setData([]);
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory(searchParams);
  }, [searchParams, loadHistory]);

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>错误</AlertTitle>
        <AlertDescription>
          {error}{" "}
          <Button
            variant="link"
            size="sm"
            onClick={() => loadHistory(searchParams)}
            className="p-0 h-auto ml-2"
          >
            重试
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return <HistoryTable data={data} count={count} isLoading={isLoading} />;
}
