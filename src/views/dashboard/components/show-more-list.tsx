"use client";

import { useState } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Eye, BarChart2, ListFilter, Loader2 } from "lucide-react";
import { fetchAllTopRepair } from "../api/data";

interface ShowMoreListProps {
  data: {
    name: string;
    count: number;
  }[];
  className?: string;
}

export function ShowMoreList({ data, className }: ShowMoreListProps) {
  const [allData, setAllData] = useState<{ name: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "chart">("list");
  const [sortBy, setSortBy] = useState<"count" | "name">("count");

  // 获取完整数据列表
  const handleOpen = async (open: boolean) => {
    setIsOpen(open);

    if (open && allData.length === 0) {
      try {
        setIsLoading(true);
        const completeData = await fetchAllTopRepair();
        setAllData(completeData);
      } catch (error) {
        console.error("获取全部数据失败:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 对数据进行排序
  const sortedData = [...(allData.length > 0 ? allData : data)].sort((a, b) => {
    if (sortBy === "count") {
      return b.count - a.count;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  // 计算最大维修次数（用于图表）
  const maxCount = Math.max(...sortedData.map((item) => item.count));

  return (
    <Sheet open={isOpen} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-center w-full gap-2"
        >
          <Eye className="h-4 w-4" />
          查看完整排行榜
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full max-w-md sm:max-w-lg p-0 flex flex-col"
      >
        <SheetHeader className="p-6 pb-2">
          <div className="flex justify-between items-center">
            <div>
              <SheetTitle>手机维修型号排行</SheetTitle>
              <SheetDescription>按维修次数统计的所有手机型号</SheetDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={cn(viewMode === "list" ? "bg-muted" : "")}
                onClick={() => setViewMode("list")}
              >
                <ListFilter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(viewMode === "chart" ? "bg-muted" : "")}
                onClick={() => setViewMode("chart")}
              >
                <BarChart2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Tabs
              defaultValue="count"
              onValueChange={(value) => setSortBy(value as "count" | "name")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="count">按维修次数</TabsTrigger>
                <TabsTrigger value="name">按型号名称</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6 pt-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">加载数据中...</p>
            </div>
          ) : (
            <div
              className={cn("space-y-4", viewMode === "chart" ? "pr-4" : "")}
            >
              {sortedData.length > 0 ? (
                sortedData.map((item, index) => (
                  <div
                    key={item.name}
                    className={cn(
                      "flex items-center py-2",
                      viewMode === "chart" ? "flex-col sm:flex-row" : ""
                    )}
                  >
                    {viewMode === "list" ? (
                      <>
                        <div
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-semibold text-sm",
                            index === 0
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-700/20 dark:text-amber-500"
                              : index === 1
                              ? "bg-slate-100 text-slate-700 dark:bg-slate-700/20 dark:text-slate-500"
                              : index === 2
                              ? "bg-orange-100 text-orange-700 dark:bg-orange-700/20 dark:text-orange-500"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {index + 1}
                        </div>
                        <div className="ml-4 flex-1 truncate">
                          <p className="text-sm font-medium leading-none truncate">
                            {item.name.trim()}
                          </p>
                        </div>
                        <div className="ml-2 font-medium text-right">
                          {item.count} 次
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-full flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-semibold text-xs",
                                index === 0
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-700/20 dark:text-amber-500"
                                  : index === 1
                                  ? "bg-slate-100 text-slate-700 dark:bg-slate-700/20 dark:text-slate-500"
                                  : index === 2
                                  ? "bg-orange-100 text-orange-700 dark:bg-orange-700/20 dark:text-orange-500"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {index + 1}
                            </div>
                            <p className="text-sm font-medium leading-none truncate">
                              {item.name.trim()}
                            </p>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {item.count} 次
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-muted">
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all",
                              index === 0
                                ? "bg-amber-500"
                                : index === 1
                                ? "bg-slate-500"
                                : index === 2
                                ? "bg-orange-500"
                                : "bg-primary"
                            )}
                            style={{
                              width: `${(item.count / maxCount) * 100}%`,
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">暂无数据</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <SheetFooter className="px-6 py-4 border-t">
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
