"use client";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { fetchRevenue, RevenueType } from "@/views/dashboard/api/data";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Wrench,
  Loader,
} from "lucide-react";
import { useCallback, useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import date from "@/lib/date";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface RevenueProps {
  data: RevenueType[];
  className?: string;
}

const chartConfig = {
  quantity: {
    label: "维修数量",
    color: "hsl(var(--chart-1))",
    icon: Wrench,
  },
  revenue: {
    label: "维修收入",
    color: "hsl(var(--chart-2))",
    icon: TrendingUp,
  },
} satisfies ChartConfig;

export const Revenue = ({ data: initialData, className }: RevenueProps) => {
  const currentYear = useMemo(() => date().year(), []);

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

  // Sync initialData if selectedYear is currentYear and initialData changes
  useEffect(() => {
    if (selectedYear === currentYear) {
      setChartData(initialData);
    }
  }, [initialData, selectedYear, currentYear]);

  // 处理数据以确保所有数据点都有有效值
  const processedData = useMemo(() => {
    const sourceData = chartData || [];

    // 1. Filter out months with no data
    const filtered = sourceData.filter(
      (item) => (item.revenue || 0) > 0 || (item.quantity || 0) > 0
    );

    // 2. Sort numerically by month (assuming item.month is string "1", "2", ...)
    const sorted = filtered.sort(
      (a, b) => parseInt(a.month, 10) - parseInt(b.month, 10)
    );

    // 3. Map to format month label for display and ensure values are numbers
    return sorted.map((item) => ({
      month: `${item.month}`,
      quantity: item.quantity || 0,
      revenue: item.revenue || 0,
    }));
  }, [chartData]);

  // 获取特定年份的数据
  const fetchYearData = useCallback(
    async (year: number) => {
      // Avoid refetching if data for the target year is already loaded
      // (Simple check; more sophisticated caching could be used)
      if (year === selectedYear && chartData.length > 0 && !error) {
        // No need to refetch if we already have data for the selected year (unless there was an error)
        // Exception: always refetch if it's not the current year's initial load
        if (year !== currentYear) return;
        if (year === currentYear && initialData === chartData) return;
      }
      // Do not refetch initial data for the current year if it exists
      if (year === currentYear && initialData.length > 0) {
        setChartData(initialData);
        setSelectedYear(currentYear); // Ensure state is correct
        setError(null); // Clear previous error
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const newData = await fetchRevenue(year);
        setChartData(newData);
      } catch (err) {
        console.error(`获取${year}年数据失败:`, err);
        setError(`无法加载${year}年的数据`);
        // Optionally clear data on error or keep old data:
        // setChartData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [currentYear, initialData, selectedYear, chartData, error]
  );

  // 切换到上一年
  const handlePreviousYear = useCallback(() => {
    const newYear = selectedYear - 1;
    if (newYear >= 2024) {
      setSelectedYear(newYear);
      fetchYearData(newYear);
    }
  }, [selectedYear, fetchYearData]);

  // 切换到下一年
  const handleNextYear = useCallback(() => {
    const newYear = selectedYear + 1;
    if (newYear <= currentYear) {
      setSelectedYear(newYear);
      fetchYearData(newYear);
    }
  }, [selectedYear, currentYear, fetchYearData]);

  // 选择年份
  const handleYearChange = useCallback(
    (value: string) => {
      const year = parseInt(value, 10);
      setSelectedYear(year);
      fetchYearData(year);
    },
    [fetchYearData]
  );

  // Custom tooltip formatter
  const tooltipFormatter = (
    value: ValueType, // Use ValueType (can be string | number | function)
    name: NameType // Use NameType (can be string | number)
    // props: Payload // props contains the full data point if needed
  ): [React.ReactNode, React.ReactNode] | React.ReactNode => {
    // Type guard to ensure value is a number before formatting
    const numericValue = typeof value === "number" ? value : 0;
    const stringName = typeof name === "string" ? name : ""; // Assuming name is string based on config

    if (stringName === "维修收入") {
      return [stringName, ": ", `€${numericValue.toLocaleString()}`];
    }
    if (stringName === "维修数量") {
      return [stringName, ": ", numericValue.toLocaleString()];
    }
    // Fallback if name doesn't match
    return [numericValue, stringName];
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-[300px] w-full items-center justify-center p-4">
          {" "}
          {/* Reduced height for content area */}
          <div className="text-center text-muted-foreground space-y-2">
            <Loader className="size-6 mx-auto animate-spin" />
            <p>加载 {selectedYear}年 数据...</p>
          </div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex h-[300px] w-full flex-col items-center justify-center p-4 text-center text-destructive">
          <AlertTriangle className="size-8 mb-2" />
          <p className="font-semibold">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => fetchYearData(selectedYear)}
          >
            重试
          </Button>
        </div>
      );
    }

    if (processedData.every((d) => d.revenue === 0 && d.quantity === 0)) {
      return (
        <div className="flex h-[300px] w-full flex-col items-center justify-center p-4 text-center text-muted-foreground">
          <BarChart3 className="size-8 mb-2" />
          <p className="font-semibold">{selectedYear}年 暂无数据</p>
          <p className="text-sm">请检查或选择其他年份。</p>
        </div>
      );
    }

    // Render the chart
    return (
      <div className="h-[300px] w-full px-2 pt-4 pb-2">
        {" "}
        {/* Add padding around chart */}
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            accessibilityLayer
            data={processedData}
            margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
          >
            {" "}
            {/* Adjusted margins */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.4}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickFormatter={(value) => `${value}`}
              width={30}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickFormatter={(value) => `€${value}`}
              width={40}
            />
            <ChartTooltip
              cursor={false} // Disable cursor line for cleaner look
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => `${selectedYear}年${label}`}
                  formatter={tooltipFormatter}
                />
              }
            />
            <ChartLegend
              content={<ChartLegendContent />}
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: "10px" }}
            />
            <Bar
              yAxisId="left"
              dataKey="quantity"
              fill="var(--color-quantity)"
              radius={3}
              name="维修数量"
            />
            <Bar
              yAxisId="right"
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={3}
              name="维修收入"
            />
          </BarChart>
        </ChartContainer>
      </div>
    );
  };

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
        <CardTitle className="text-base font-semibold">
          {" "}
          {/* Adjusted font size/weight */}
          收入与维修统计 ({selectedYear})
        </CardTitle>
        {/* Year navigation controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7" // Smaller buttons
            onClick={handlePreviousYear}
            disabled={selectedYear <= 2024 || isLoading}
            aria-label="上一年"
          >
            {" "}
            <ChevronLeft className="h-4 w-4" />{" "}
          </Button>
          <Select
            value={selectedYear.toString()}
            onValueChange={handleYearChange}
            disabled={isLoading}
          >
            <SelectTrigger className="h-7 w-[100px] px-2 text-xs">
              {" "}
              {/* Smaller select */}
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem
                  key={year}
                  value={year.toString()}
                  className="text-xs"
                >
                  {year}年
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleNextYear}
            disabled={selectedYear >= currentYear || isLoading}
            aria-label="下一年"
          >
            {" "}
            <ChevronRight className="h-4 w-4" />{" "}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        {" "}
        {/* flex-1 allows content to grow */}
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default Revenue;
