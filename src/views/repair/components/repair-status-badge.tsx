import { Badge, type BadgeProps } from "@/components/ui/badge";
import { RepairStatus, RepairWarrantyStatus } from "../schema/repair.schema";
import { cn } from "@/lib/utils";

type StatusStyle = {
  variant: BadgeProps["variant"];
  className?: string;
};

// Helper to get badge style based on status
export const getStatusBadgeStyle = (
  status: RepairStatus | RepairWarrantyStatus | string | null | undefined
): StatusStyle => {
  switch (status) {
    // Pending / Reworking (Yellow/Orange)
    case RepairStatus.PENDING:
    case RepairWarrantyStatus.REWORKING:
      return {
        variant: "outline",
        className:
          "text-yellow-600 border-yellow-400 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-600 dark:bg-yellow-900/30",
      };

    // Repairing (Blue)
    case RepairStatus.REPAIRING:
      return {
        variant: "outline",
        className:
          "text-blue-600 border-blue-400 bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:bg-blue-900/30",
      };

    // Repaired / Reworked (Green)
    case RepairStatus.REPAIRED:
    case RepairWarrantyStatus.REWORKED:
      return { variant: "default", className: "border-transparent" }; // Use success variant

    // Taken (Gray/Subtle)
    case RepairStatus.TAKED:
    case RepairWarrantyStatus.TAKED:
      return { variant: "secondary", className: "text-muted-foreground" };

    // Not Repairable (Red/Destructive)
    case RepairStatus.NOREPAIREBLE:
      return { variant: "destructive", className: "border-transparent" };

    // Default / Unknown
    default:
      return { variant: "outline", className: "text-muted-foreground italic" };
  }
};

interface RepairStatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: RepairStatus | RepairWarrantyStatus | string | null | undefined;
}

export const RepairStatusBadge: React.FC<RepairStatusBadgeProps> = ({
  status,
  className,
  ...props
}) => {
  const style = getStatusBadgeStyle(status);
  return (
    <Badge
      variant={style.variant}
      className={cn("text-xs", style.className, className)}
      {...props}
    >
      {status ?? "未知状态"}
    </Badge>
  );
};
