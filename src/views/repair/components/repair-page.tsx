"use client";
import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";
import { Separator } from "@/components/ui/separator";
import { RepairSearch } from "@/views/repair/schema/repair.schema";
import { countRepairs, fetchRepairs } from "@/views/repair/api/repair";
import { RepairTable } from "@/views/repair/components/repair-table";
import { CreateRepair } from "@/views/repair/components/create-repair";
import { useCallback, useEffect, useRef, useState } from "react";
import { RepairWithCustomer } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import type { AuthError, RealtimeChannel } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RepairPageProps {
  searchParams: RepairSearch;
  initialData: RepairWithCustomer[];
  initialTotalPage: number;
  fetchError: string | null;
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "维修管理", link: "/dashboard/repairs" },
];

export const RepairPage = ({
  searchParams,
  initialData,
  initialTotalPage,
  fetchError,
}: RepairPageProps) => {
  const router = useRouter();
  const [repairs, setRepairs] = useState<RepairWithCustomer[]>(
    initialData ?? []
  );
  const [totalPage, setTotalPage] = useState(initialTotalPage ?? 0);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Initial data is from server
  const [error, setError] = useState<string | null>(fetchError);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(true); // Track connection status
  const supabase = useRef(createClient()); // Store client in ref for stable reference
  const channelRef = useRef<RealtimeChannel | null>(null); // Store channel in ref

  // 提取加载数据逻辑为可重用的函数
  const loadData = useCallback(async (currentSearch: RepairSearch) => {
    setIsLoading(true);
    try {
      const [fetchedData, fetchedCount] = await Promise.all([
        fetchRepairs(currentSearch),
        countRepairs(currentSearch),
      ]);
      setRepairs(fetchedData ?? []);
      setTotalPage(fetchedCount ?? 0);
      setError(null);
      setIsRealtimeConnected(true);
    } catch (error) {
      const errMsg = (error as AuthError).message || "无法加载维修数据。";
      setError(errMsg);
      setRepairs([]);
      setTotalPage(0);
      setIsRealtimeConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  //Effect to load data when search params prop changes
  useEffect(() => {
    loadData(searchParams);
  }, [searchParams, loadData]);

  // supabase 实时订阅
  useEffect(() => {
    const client = supabase.current;
    setIsRealtimeConnected(true);

    const cleanupChannel = () => {
      if (channelRef.current) {
        console.log("Removing previous Realtime channel.");
        client
          .removeChannel(channelRef.current)
          .catch((err) =>
            console.error("Error removing channel on cleanup:", err)
          );
        channelRef.current = null;
      }
    };
    cleanupChannel();

    // Create the new channel
    const channel = client
      .channel("repairs-realtime")
      .on<RepairWithCustomer>(
        "postgres_changes",
        { event: "*", schema: "public", table: "repairs" },
        (payload) => {
          console.log("Realtime Change received:", payload);
          toast.info("维修列表已更新。"); // More subtle notification
          // Option 1: Optimistic UI update (more complex)
          // Option 2: Refetch data (simpler)
          loadData(searchParams); // Reload using *current* search params
        }
      )
      .subscribe((status, err) => {
        console.log("Realtime Subscription Status:", status, err || "");
        if (status === "SUBSCRIBED") {
          setIsRealtimeConnected(true);
        } else if (status === "CLOSED") {
          // Closed intentionally? Don't show warning maybe
          setIsRealtimeConnected(false);
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setIsRealtimeConnected(false);
          toast.warning("实时更新连接中断，正在尝试重连...", {
            duration: 5000,
          });
          // Consider a more robust retry mechanism if needed,
          // but Supabase client usually handles basic retries.
        }
      });

    // Store the channel in ref
    channelRef.current = channel;

    // --- Stability Enhancements ---

    // 1. Visibility Change: Refresh data when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Tab became visible, reloading data...");
        // Check channel status? Supabase client *should* auto-reconnect
        // For robustness, just reload data.
        loadData(searchParams);
        // Optionally try resubscribing if channel state seems off
        if (channelRef.current?.state !== "joined") {
          channelRef.current?.subscribe();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function
    return () => {
      console.log("Cleaning up Realtime useEffect.");
      cleanupChannel(); // Remove channel on component unmount
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // clearInterval(intervalId); // Clear interval if using it
    };
  }, [loadData, searchParams]);

  const handleSuccess = useCallback(() => {
    loadData(searchParams); // Reload data on success
  }, [loadData, searchParams]);

  return (
    <div className="flex-1 space-y-4 pt-6 p-4 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-center justify-between">
        <Header title="维修管理" description="跟踪和管理所有维修订单。" />
        {/* Realtime Status Indicator */}
        <div
          className={cn(
            "flex items-center gap-1.5 text-xs px-2 py-1 rounded-full",
            isRealtimeConnected
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700 animate-pulse"
          )}
        >
          {isRealtimeConnected ? (
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          ) : (
            <WifiOff className="w-3 h-3" />
          )}
          {isRealtimeConnected ? "实时更新已连接" : "实时更新连接中..."}
        </div>
        <CreateRepair onSuccess={handleSuccess} />
      </div>
      <Separator />

      {error && !isLoading && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>加载错误</AlertTitle>
          <AlertDescription>
            {error}
            <Button
              variant="link"
              size="sm"
              onClick={() => loadData(searchParams)}
              className="p-0 h-auto ml-2"
            >
              重试
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <RepairTable
        data={repairs}
        count={totalPage} // Pass total row count
        isLoading={isLoading}
        refetchData={handleSuccess} // Pass refetch/success handler
      />
    </div>
  );
};
