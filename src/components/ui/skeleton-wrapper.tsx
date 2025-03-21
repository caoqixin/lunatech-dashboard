import { Skeleton } from "./skeleton";

interface SkeletonWrapperProps {
  count?: number;
  className?: string;
  variant?: "card" | "table-row" | "line";
}

export function SkeletonWrapper({
  count = 3,
  className = "",
  variant = "line",
}: SkeletonWrapperProps) {
  const variants = {
    "table-row": "h-10 w-full",
    card: "h-[180px] w-full rounded-lg",
    line: "h-4 w-full",
  };

  return (
    <div className="space-y-2">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className={`${variants[variant]} ${className}`} />
        ))}
    </div>
  );
}
