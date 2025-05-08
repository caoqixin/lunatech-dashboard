"use client";

import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  EyeOff,
  Settings2,
} from "lucide-react";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const canSort = column.getCanSort();
  const canHide = column.getCanHide();

  if (!canSort && !canHide) {
    // If neither sortable nor hideable, just return the title
    return <div className={cn("whitespace-nowrap", className)}>{title}</div>;
  }

  const sortDirection = column.getIsSorted();

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {" "}
      {/* Reduced gap */}
      {/* Title should not be clickable if only hiding is possible */}
      <span className={cn("whitespace-nowrap", !canSort && "mr-1")}>
        {title}
      </span>
      {/* Use a single trigger button if either sort or hide is possible */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="列选项"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 data-[state=open]:bg-accent" // Compact size, highlight on open
          >
            {canSort && sortDirection === "asc" ? (
              <ArrowUp className="size-3.5 text-muted-foreground" />
            ) : canSort && sortDirection === "desc" ? (
              <ArrowDown className="size-3.5 text-muted-foreground" />
            ) : canSort ? ( // If sortable but not sorted
              <ChevronsUpDown className="size-3.5 text-muted-foreground/70" />
            ) : (
              // If not sortable but hideable
              <Settings2 className="size-3.5 text-muted-foreground/70" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {canSort && ( // Only show sorting options if sortable
            <>
              <DropdownMenuItem
                aria-label="升序排序"
                onClick={() => column.toggleSorting(false)}
                disabled={sortDirection === "asc"}
              >
                <ArrowUp className="mr-2 size-3.5 text-muted-foreground/70" />
                <span>升序</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                aria-label="降序排序"
                onClick={() => column.toggleSorting(true)}
                disabled={sortDirection === "desc"}
              >
                <ArrowDown className="mr-2 size-3.5 text-muted-foreground/70" />
                <span>降序</span>
              </DropdownMenuItem>
              {canHide && <DropdownMenuSeparator />}{" "}
              {/* Separator only if hide is also possible */}
            </>
          )}
          {canHide && ( // Only show hiding option if hideable
            <DropdownMenuItem
              aria-label="隐藏列"
              onClick={() => column.toggleVisibility(false)}
            >
              <EyeOff className="mr-2 size-3.5 text-muted-foreground/70" />
              <span>隐藏</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
