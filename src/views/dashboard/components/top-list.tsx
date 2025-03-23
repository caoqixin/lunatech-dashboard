"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Smartphone } from "lucide-react";
import { ShowMoreList } from "./show-more-list";

interface TopListProps {
  data: {
    name: string;
    count: number;
  }[];
  className?: string;
}

export function TopList({ data, className }: TopListProps) {
  // 获取最高维修量以设置进度条比例
  const maxCount = Math.max(...data.map((item) => item.count));

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>最常维修手机型号</CardTitle>
            <CardDescription>
              基于历史数据统计的维修频率最高的手机型号
            </CardDescription>
          </div>
          <Smartphone className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.slice(0, 5).map((item, index) => (
            <div key={item.name} className="flex items-center">
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
              <div className="ml-3 flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{item.name}</p>
                <div className="flex items-center pt-2">
                  <div className="h-2 w-full rounded-full bg-muted">
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
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground min-w-10 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <ShowMoreList data={data} />
      </CardFooter>
    </Card>
  );
}

export default TopList;
