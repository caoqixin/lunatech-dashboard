import { calculatePercentageChange, cn, toEUR } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  ArrowDownRight,
  ArrowUpRight,
  Package,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cardIconVariants = cva("p-2 rounded-full", {
  variants: {
    variant: {
      revenue:
        "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
      count: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    },
  },
  defaultVariants: {
    variant: "revenue",
  },
});

interface CardWrapperProps {
  title: string;
  value: number;
  lastValue?: number;
  type: "revenue" | "count";
  className?: string;
}

export function CardWrapper({
  title,
  value,
  lastValue,
  type,
  className,
}: CardWrapperProps) {
  const isRevenue = type === "revenue";

  // 根据类型选择图标和值的格式化方式
  const Icon = isRevenue
    ? TrendingUp
    : title.includes("库存")
    ? Package
    : Wrench;

  const formattedValue = isRevenue ? toEUR(value) : value.toLocaleString();
  const formattedLastValue = isRevenue
    ? toEUR(lastValue)
    : lastValue?.toLocaleString();
  const descText = title.includes("年") ? "去年" : "上个月";

  const changeValue = calculatePercentageChange(value, lastValue);

  const isPositive = Math.max(0, changeValue) > 0;

  return (
    <Card className={cn("overflow-hidden transition-all", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cardIconVariants({ variant: type })}>
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {lastValue && (
          <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
            <span>
              {descText}
              <span className="font-medium ml-1">{formattedLastValue}</span>
            </span>

            <div className="flex">
              {isPositive ? (
                <ArrowUpRight className="mr-1 size-3.5" />
              ) : (
                <ArrowDownRight className="mr-1 size-3.5" />
              )}
              <span>
                相比上期{" "}
                <span
                  className={cn(
                    "font-medium ",
                    isPositive
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500 dark:text-red-500"
                  )}
                >
                  {changeValue}%
                </span>
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

//   const [
//     annualy,
//     monthly,
//     annualyRepairs,
//     monthlyRepairs,
//     componentsStock,
//     componentsTotalPrice,
//   ] = await Promise.all([
//     fetchAnnualy(),
//     fetchMonthly(),
//     fetchAnnualyRepair(),
//     fetchMonthlyRepair(),
//     fetchAllComponentsStock(),
//     fetchAllComponentsPrice(),
//   ]);

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-cols-min gap-4">
//       <XinCard title="年收入" value={toEUR(annualy)} />
//       <XinCard title="月收入" value={toEUR(monthly)} />
//       <XinCard title="年维修" value={annualyRepairs} />
//       <XinCard title="月维修" value={monthlyRepairs} />
//       <XinCard title="配件库存" value={componentsStock} />
//       <XinCard title="配件价格" value={toEUR(componentsTotalPrice)} />
//     </div>
//   );
// };
