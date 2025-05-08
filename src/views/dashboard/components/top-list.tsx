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
import { Smartphone, Crown, Medal, Trophy } from "lucide-react";
import { ShowMoreList } from "./show-more-list";
import { Progress } from "@/components/ui/progress";
import { useMemo } from "react";

interface TopListProps {
  data: {
    name: string;
    count: number;
  }[];
  className?: string;
}

// Helper to get ranking icon and color
export const getRankStyle = (
  index: number
): { Icon: React.ElementType; colorClass: string } => {
  if (index === 0)
    return { Icon: Crown, colorClass: "text-amber-500 dark:text-amber-400" };
  if (index === 1)
    return { Icon: Medal, colorClass: "text-slate-500 dark:text-slate-400" };
  if (index === 2)
    return { Icon: Trophy, colorClass: "text-orange-600 dark:text-orange-500" }; // Bronze/Orange
  return {
    Icon: () => <span className="text-xs font-semibold">{index + 1}</span>,
    colorClass: "text-muted-foreground",
  }; // Use number for others
};

// Helper to get progress bar color based on rank
const getProgressColor = (index: number): string => {
  if (index === 0) return "bg-amber-500";
  if (index === 1) return "bg-slate-500";
  if (index === 2) return "bg-orange-500";
  return "bg-primary"; // Default color
};

export function TopList({ data, className }: TopListProps) {
  // Ensure data is sorted by count descending for ranking
  const sortedData = useMemo(
    () => [...data].sort((a, b) => b.count - a.count),
    [data]
  );
  const maxCount = sortedData.length > 0 ? sortedData[0].count : 1; // Use first item's count as max, avoid division by zero

  return (
    <Card className={cn("flex h-full flex-col", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">
              最常维修型号 Top 5
            </CardTitle>
            <CardDescription className="text-xs">
              维修频率最高的手机型号排名
            </CardDescription>
          </div>
          <Smartphone className="h-5 w-5 shrink-0 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-2">
        {sortedData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            暂无排行数据
          </div>
        ) : (
          <div className="space-y-4">
            {sortedData.slice(0, 5).map((item, index) => {
              const { Icon, colorClass } = getRankStyle(index);
              const progressColor = getProgressColor(index);
              const progressValue =
                maxCount > 0 ? (item.count / maxCount) * 100 : 0;

              return (
                <div key={item.name} className="flex items-center gap-3">
                  {/* Rank Icon/Number */}
                  <div
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full",
                      colorClass
                    )}
                  >
                    <Icon className={index < 3 ? "size-4" : ""} />{" "}
                    {/* Icon size for top 3 */}
                  </div>
                  {/* Name and Progress Bar */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-sm font-medium leading-tight">
                        {item.name}
                      </p>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {item.count} 次
                      </span>
                    </div>
                    {/* Use Shadcn Progress component */}
                    <Progress
                      value={progressValue}
                      className={cn("h-1.5", progressColor)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      {/* Footer only shown if there's data */}
      {sortedData.length > 0 && (
        <CardFooter className="pt-4">
          {" "}
          {/* Add padding top */}
          <ShowMoreList data={sortedData} /> {/* Pass sorted data */}
        </CardFooter>
      )}
    </Card>
  );
}

export default TopList;
