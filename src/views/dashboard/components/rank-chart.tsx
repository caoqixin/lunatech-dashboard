import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useMemo } from "react";

interface RankChartProps {
  data: { name: string; count: number }[];
}

const RankChart = ({ data }: RankChartProps) => {
  // Take top N for chart for better readability, e.g., top 15
  const chartData = useMemo(() => data.slice(0, 15).reverse(), [data]); // Reverse for chart display (bottom to top)
  const maxCount = useMemo(
    () =>
      chartData.length > 0
        ? Math.max(...chartData.map((item) => item.count))
        : 1,
    [chartData]
  );

  return (
    <div className="h-[500px] w-full pt-4 pr-2">
      {" "}
      {/* Adjust height and padding as needed */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        >
          <XAxis type="number" hide domain={[0, maxCount]} />{" "}
          {/* Hide X axis, domain set */}
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, width: 100 }} // Adjust tick style
            width={110} // Adjust width for labels
            interval={0} // Show all labels
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted) / 0.3)" }} // Use muted color for cursor fill
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              borderColor: "hsl(var(--border))",
              fontSize: "12px",
              borderRadius: "var(--radius)",
            }}
            formatter={(value: number) => [
              value.toLocaleString() + " 次",
              "维修次数",
            ]}
          />
          <Bar
            dataKey="count"
            fill="hsl(var(--primary))"
            radius={[0, 4, 4, 0]}
            barSize={12}
          >
            {" "}
            {/* Adjust radius and size */}
            {/* Optionally add labels inside bars if space allows */}
            <LabelList
              dataKey="count"
              position="right"
              offset={5}
              fontSize={10}
              fill="hsl(var(--muted-foreground))"
              formatter={(value: number) => value.toLocaleString()}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RankChart;
