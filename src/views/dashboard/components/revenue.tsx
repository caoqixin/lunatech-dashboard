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
import { RevenueType } from "@/views/dashboard/api/data";

interface RevenueProps {
  data: RevenueType[];
}

const chartConfig = {
  quantity: {
    label: "维修数量",
    color: "hsl(var(--chart-1))",
  },
  revenue: {
    label: "维修收入",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const Revenue = ({ data }: RevenueProps) => {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="quantity" fill="var(--color-quantity)" radius={4} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};
