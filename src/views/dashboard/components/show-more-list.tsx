"use client";

import { useState, useMemo, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Eye,
  BarChart2,
  ListFilter,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { fetchAllTopRepair } from "../api/data";
import { Skeleton } from "@/components/ui/skeleton";
import { getRankStyle } from "./top-list";

const LazyRankChart = lazy(() => import("./rank-chart"));

interface ShowMoreListProps {
  data: {
    name: string;
    count: number;
  }[];
  className?: string;
}

export function ShowMoreList({
  data: initialTop5Data,
  className,
}: ShowMoreListProps) {
  const [allData, setAllData] = useState<{ name: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "chart">("list");

  // 获取完整数据列表
  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);

    // Reset state when closing
    if (!open) {
      setError(null);
      return;
    }

    if (open && allData.length === 0) {
      setIsLoading(true);
      setError(null);
      try {
        const completeData = await fetchAllTopRepair();
        completeData.sort((a, b) => b.count - a.count);
        setAllData(completeData);
      } catch (error) {
        console.error("获取全部数据失败:", error);
        setError("无法加载完整列表，请稍后重试。");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Use computed data based on whether full data is loaded
  const displayData = useMemo(() => {
    return allData.length > 0 ? allData : initialTop5Data;
  }, [allData, initialTop5Data]);

  // --- Render Content Inside Sheet ---
  const renderSheetContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center flex-1 py-12">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">加载完整排名中...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center flex-1 py-12 text-destructive text-center">
          <AlertTriangle className="h-8 w-8 mb-3" />
          <p className="font-semibold mb-1">加载失败</p>
          <p className="text-sm mb-4">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(true)}
          >
            重试
          </Button>
        </div>
      );
    }
    if (displayData.length === 0) {
      return (
        <div className="flex items-center justify-center flex-1 py-12 text-muted-foreground">
          暂无数据
        </div>
      );
    }

    // Render List or Chart
    if (viewMode === "list") {
      // List rendering logic remains the same, but no dependency on sortBy in key
      return (
        <div className="space-y-1 divide-y divide-border/50">
          {displayData.map((item, index) => {
            const { Icon, colorClass } = getRankStyle(index);
            return (
              <div
                key={item.name}
                className="flex items-center gap-3 py-2.5 px-1"
              >
                {" "}
                {/* Key uses only name */}
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full",
                    colorClass
                  )}
                >
                  <Icon className={index < 3 ? "size-4" : ""} />
                </div>
                <div className="flex-1 truncate">
                  <p className="truncate text-sm font-medium leading-snug">
                    {item.name.trim()}
                  </p>
                </div>
                <div className="ml-2 text-sm font-semibold text-muted-foreground">
                  {item.count} 次
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      // Chart View remains the same
      return (
        <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
          <LazyRankChart data={displayData} />
        </Suspense>
      );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="link"
          className="h-auto p-0 text-sm text-muted-foreground hover:text-primary"
        >
          查看完整排行榜 <Eye className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full max-w-md sm:max-w-lg p-0 flex flex-col"
      >
        <SheetHeader className="p-4 pb-2 border-b">
          <div className="flex justify-between items-center mb-2">
            <div>
              <SheetTitle className="text-lg">手机维修型号排行</SheetTitle>
              {/* Updated Description */}
              <SheetDescription className="text-xs">
                按维修次数从高到低排序
              </SheetDescription>
            </div>
            {/* View Mode Toggle remains */}
            <div className="flex items-center gap-1 rounded-md border bg-muted p-0.5">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2"
                onClick={() => setViewMode("list")}
                aria-label="列表视图"
              >
                {" "}
                <ListFilter className="h-4 w-4" />{" "}
              </Button>
              <Button
                variant={viewMode === "chart" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2"
                onClick={() => setViewMode("chart")}
                aria-label="图表视图"
              >
                {" "}
                <BarChart2 className="h-4 w-4" />{" "}
              </Button>
            </div>
          </div>
          {/* REMOVED Tabs for sorting */}
          {/* <Tabs defaultValue={sortBy} onValueChange={(value) => setSortBy(value as "count" | "name")}> ... </Tabs> */}
        </SheetHeader>

        <ScrollArea className="flex-1 px-4 py-2">
          {renderSheetContent()}
        </ScrollArea>

        <SheetFooter className="px-4 py-3 border-t">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              关闭
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
