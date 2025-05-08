import { calculatePercentageChange, cn, toEUR } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  ArrowDownRight,
  ArrowUpRight,
  Package,
  TrendingUp,
  Wrench,
  Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cardIconVariants = cva("p-1.5 rounded-full", {
  variants: {
    variant: {
      revenue:
        "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400",
      count: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400",
    },
  },
  defaultVariants: {
    variant: "revenue",
  },
});

interface CardWrapperProps {
  title: string;
  value: number;
  lastValue?: number | null; // Allow null
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

  let changeValue: number | null = null;
  let changeText: string | null = null;
  let ChangeIcon: React.ElementType | null = null;
  let changeColorClass = "text-muted-foreground";
  if (typeof lastValue === "number" && lastValue !== null) {
    // Only calculate if lastValue is valid
    const formattedLastValue = isRevenue
      ? toEUR(lastValue)
      : lastValue.toLocaleString();
    const descText = title.includes("年") ? "去年" : "上个月";
    changeValue = calculatePercentageChange(value, lastValue); // Assume this handles division by zero

    if (changeValue > 0) {
      ChangeIcon = ArrowUpRight;
      changeColorClass = "text-green-600 dark:text-green-400";
      changeText = `相比 ${descText} (${formattedLastValue}) `;
    } else if (changeValue < 0) {
      ChangeIcon = ArrowDownRight;
      changeColorClass = "text-red-500 dark:text-red-400"; // Slightly adjust dark red
      changeText = `相比 ${descText} (${formattedLastValue}) `;
    } else {
      // changeValue is 0 or NaN/Infinity handled inside calculation
      ChangeIcon = Minus; // Indicate no change
      changeText = `与 ${descText} (${formattedLastValue}) 持平`;
    }
  }
  // --- End Percentage Change Logic ---

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-md",
        className
      )}
    >
      {" "}
      {/* Default shadow-md */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {" "}
        {/* Remove space-y-0 */}
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(cardIconVariants({ variant: type }))}>
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {/* Conditional rendering for the change description */}
        {changeText !== null && ChangeIcon !== null ? (
          <div className="mt-1 flex items-center text-xs text-muted-foreground">
            <ChangeIcon className={cn("mr-1 size-3.5", changeColorClass)} />
            <span className="whitespace-nowrap">{changeText}</span>
            {/* Show percentage only if change is not zero */}
            {changeValue !== 0 && changeValue !== null && (
              <span className={cn("ml-1 font-medium", changeColorClass)}>
                {changeValue > 0 ? "+" : ""}
                {changeValue.toFixed(1)}%
              </span>
            )}
          </div>
        ) : (
          // Optional: Placeholder if no comparison data
          <div className="mt-1 h-[18px] text-xs text-muted-foreground/50 italic">
            无对比数据
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
