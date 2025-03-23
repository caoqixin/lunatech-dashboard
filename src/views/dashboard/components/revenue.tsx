"use client";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { type ChartConfig } from "@/components/ui/chart";
import { fetchRevenue, RevenueType } from "@/views/dashboard/api/data";
import { BarChart3, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import date from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface RevenueProps {
  data: RevenueType[];
  className?: string;
}

const chartConfig = {
  quantity: {
    label: "维修数量",
    color: "hsl(var(--chart-1))",
    icon: BarChart3,
  },
  revenue: {
    label: "维修收入",
    color: "hsl(var(--chart-2))",
    icon: TrendingUp,
  },
} satisfies ChartConfig;

export const Revenue = ({ data: initialData, className }: RevenueProps) => {
  const currentYear = date().year();

  // 设置可选年份范围（从2024到当前年份）
  const availableYears = useMemo(() => {
    const years = [];
    for (let year = 2024; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  }, [currentYear]);

  // 状态管理
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [chartData, setChartData] = useState<RevenueType[]>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 处理数据以确保所有数据点都有有效值
  const processedData = useMemo(() => {
    return chartData.map((item) => ({
      ...item,
      revenue: item.revenue || 0,
      quantity: item.quantity || 0,
    }));
  }, [chartData]);

  // 获取特定年份的数据
  const fetchYearData = useCallback(
    async (year: number) => {
      if (year === currentYear && initialData.length > 0) {
        // 如果是当前年份且有初始数据，直接使用初始数据
        setChartData(initialData);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const newData = await fetchRevenue(year);
        setChartData(newData);
      } catch (err) {
        console.error(`获取${year}年数据失败:`, err);
        setError(`无法加载${year}年的数据`);
        // 保留当前数据，不清空
      } finally {
        setIsLoading(false);
      }
    },
    [currentYear, initialData]
  );

  // 切换到上一年
  const handlePreviousYear = () => {
    if (selectedYear > 2024) {
      const newYear = selectedYear - 1;
      setSelectedYear(newYear);
      fetchYearData(newYear);
    }
  };

  // 切换到下一年
  const handleNextYear = () => {
    if (selectedYear < currentYear) {
      const newYear = selectedYear + 1;
      setSelectedYear(newYear);
      fetchYearData(newYear);
    }
  };

  // 选择年份
  const handleYearChange = (value: string) => {
    const year = parseInt(value, 10);
    setSelectedYear(year);
    fetchYearData(year);
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">收入与维修统计</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousYear}
            disabled={selectedYear <= 2024 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Select
            value={selectedYear.toString()}
            onValueChange={handleYearChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder={selectedYear.toString()} />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}年
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextYear}
            disabled={selectedYear >= currentYear || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="h-[350px] w-full flex justify-center items-center">
            <div className="text-center">
              <div className="w-full">
                <Skeleton className="h-[300px] w-full rounded-lg" />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                加载{selectedYear}年数据...
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="h-[350px] w-full flex justify-center items-center">
            <div className="text-center text-destructive">
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => fetchYearData(selectedYear)}
              >
                重试
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-[350px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart
                accessibilityLayer
                data={processedData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.2}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `${value}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `€${value}`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        if (name === "revenue")
                          return ["维修收入: ", `€ ${value}`];
                        return ["维修数量:", value];
                      }}
                    />
                  }
                />
                <ChartLegend
                  content={<ChartLegendContent />}
                  verticalAlign="top"
                  align="right"
                />
                <Bar
                  yAxisId="left"
                  dataKey="quantity"
                  fill="var(--color-quantity)"
                  radius={[4, 4, 0, 0]}
                  name="quantity"
                />
                <Bar
                  yAxisId="right"
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={[4, 4, 0, 0]}
                  name="revenue"
                />
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Revenue;
