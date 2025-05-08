"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useTransition,
  useRef,
  useMemo,
} from "react";
import type { CellContext, TableMeta } from "@tanstack/react-table";
import type { Component } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader, Plus, Minus } from "lucide-react";
import { cn, getQualityBadgeStyle, toEUR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  updateComponentName,
  updateComponentQuality,
  updateComponentStock,
} from "../api/component";
import { toast } from "sonner";
import { Qualities } from "../schema/component.schema";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Define the expected structure of the meta object passed from useDataTable
interface ComponentTableMeta extends TableMeta<Component> {
  onSuccess?: () => void;
}

// --- Name Cell ---
export const EditableNameCell = React.memo(
  ({ getValue, row, table }: CellContext<Component, string>) => {
    const initialValue = getValue() ?? "";
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(initialValue);
    const [isPending, startTransition] = useTransition(); // For API call loading state
    const inputRef = useRef<HTMLInputElement>(null); // Ref for autofocus
    const tableMeta = table.options.meta as ComponentTableMeta | undefined;

    // Sync with external changes
    useEffect(() => {
      setCurrentValue(initialValue);
    }, [initialValue]);

    // Autofocus when editing starts
    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.select();
      }
    }, [isEditing]);

    const handleSave = useCallback(() => {
      const trimmedValue = currentValue?.trim() ?? "";

      if (!trimmedValue) {
        // Prevent saving empty name
        toast.error("配件名称不能为空。");
        setCurrentValue(initialValue); // Revert to original value
        setIsEditing(false);
        return;
      }

      if (trimmedValue !== initialValue) {
        startTransition(async () => {
          try {
            const { msg, status } = await updateComponentName(
              trimmedValue,
              row.original.id
            );
            if (status === "success") {
              toast.success(msg);
              tableMeta?.onSuccess?.(); // Trigger external refresh
            } else {
              toast.error(msg);
              setCurrentValue(initialValue); // Revert internal state on failure
            }
          } catch (error) {
            toast.error("更新名称失败");
            setCurrentValue(initialValue); // Revert internal state on error
          } finally {
            setIsEditing(false);
          }
        });
      } else {
        setIsEditing(false); // Exit if no change
      }
    }, [
      currentValue,
      initialValue,
      row.original.id,
      startTransition,
      tableMeta,
    ]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSave();
      } else if (event.key === "Escape") {
        event.preventDefault();
        setCurrentValue(initialValue); // Revert value
        setIsEditing(false);
      }
    };

    if (isEditing) {
      return (
        <div className="relative">
          <Input
            ref={inputRef}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-8 text-sm pr-8" // Increased padding for loader
            disabled={isPending}
            aria-label="编辑名称"
          />
          {isPending && (
            <Loader className="absolute right-1.5 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
          )}
        </div>
      );
    }

    return (
      <div
        className="font-medium truncate cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded min-h-[28px] flex items-center" // Style for clickable area
        onClick={() => setIsEditing(true)}
        title="点击编辑"
      >
        {currentValue || (
          <span className="italic text-muted-foreground">未命名</span>
        )}
      </div>
    );
  }
);
EditableNameCell.displayName = "EditableNameCell";

// --- Quality Cell ---
export const EditableQualityCell = React.memo(
  ({ getValue, row, table }: CellContext<Component, string>) => {
    const initialValue = getValue() ?? "";

    const [isEditing, setIsEditing] = useState(false);
    const [isPending, startTransition] = useTransition();
    const qualityOptions = useMemo(() => Object.values(Qualities), []);
    const qualityStyle = getQualityBadgeStyle(initialValue); // Use helper
    const tableMeta = table.options.meta as ComponentTableMeta | undefined;

    const handleSave = useCallback(
      (newValue: string) => {
        setIsEditing(false); // Close select immediately
        if (newValue && newValue !== initialValue) {
          startTransition(async () => {
            try {
              const { msg, status } = await updateComponentQuality(
                newValue,
                row.original.id
              );
              if (status === "success") {
                toast.success(msg);
                tableMeta?.onSuccess?.();
                // If parent updates data, the initialValue prop will change, causing re-render
              } else {
                toast.error(msg);
              }
            } catch {
              toast.error("更新品质失败");
            }
          });
        }
      },
      [initialValue, row.original.id, startTransition, tableMeta]
    );

    // Render Badge or Select
    if (isEditing) {
      return (
        <Select
          // defaultValue={initialValue} // Use value for controlled if needed, but defaultValue works with onValueChange save
          value={initialValue} // Reflect the current actual data value
          onValueChange={handleSave}
          onOpenChange={(open) => {
            if (!open) setIsEditing(false);
          }} // Set editing false when closed
          disabled={isPending}
          open={isEditing} // Control open state
        >
          {/* Keep trigger visible but maybe subtle while open? Or hide it */}
          <SelectTrigger
            className="h-8 text-xs w-full min-w-[150px]"
            aria-label="选择品质"
          >
            <SelectValue placeholder="选择品质..." />
            {isPending && <Loader className="ml-auto size-4 animate-spin" />}
          </SelectTrigger>
          <SelectContent>
            {qualityOptions.map((quality) => (
              <SelectItem key={quality} value={quality} className="text-xs">
                {quality}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Badge
        variant={qualityStyle.variant}
        className={cn(
          "text-xs font-medium cursor-pointer hover:opacity-80",
          qualityStyle.className
        )}
        onClick={() => setIsEditing(true)}
        title="点击编辑品质"
      >
        {qualityStyle.label}
      </Badge>
    );
  }
);
EditableQualityCell.displayName = "EditableQualityCell";

// --- Stock Cell ---
export const EditableStockCell = React.memo(
  ({ getValue, row, table }: CellContext<Component, number>) => {
    const initialValue = useMemo(() => getValue() ?? 0, [getValue]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState<number>(initialValue);
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);
    const tableMeta = table.options.meta as ComponentTableMeta | undefined;

    useEffect(() => {
      setCurrentValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
      if (isEditing) inputRef.current?.select();
    }, [isEditing]);

    const handleSave = useCallback(() => {
      if (currentValue !== initialValue && !isNaN(currentValue)) {
        const stockValue = Math.max(0, currentValue);
        startTransition(async () => {
          try {
            const { msg, status } = await updateComponentStock(
              stockValue,
              row.original.id
            );
            if (status === "success") {
              toast.success(msg);
              tableMeta?.onSuccess?.();
            } else {
              toast.error(msg);
              setCurrentValue(initialValue);
            }
          } catch (error) {
            toast.error("更新库存失败");
            setCurrentValue(initialValue);
          } finally {
            setIsEditing(false);
          }
        });
      } else {
        setIsEditing(false);
        if (currentValue !== initialValue) setCurrentValue(initialValue);
      }
    }, [
      currentValue,
      initialValue,
      row.original.id,
      startTransition,
      tableMeta,
    ]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSave();
      } else if (event.key === "Escape") {
        event.preventDefault();
        setCurrentValue(initialValue);
        setIsEditing(false);
      }
    };

    const adjustStock = (amount: number) => {
      // Directly update state, rely on blur/enter to save
      setCurrentValue((prev) => Math.max(0, prev + amount));
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    if (isEditing) {
      return (
        <div className="flex items-center justify-center gap-1 w-24 relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground shrink-0"
            onClick={() => adjustStock(-1)}
            onMouseDown={handleMouseDown}
            disabled={isPending}
          >
            {" "}
            <Minus className="size-3" />{" "}
          </Button>
          <Input
            ref={inputRef}
            type="number"
            min="0"
            value={currentValue} // Use number directly
            onChange={(e) => setCurrentValue(parseInt(e.target.value, 10) || 0)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-8 w-12 text-sm text-center px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            disabled={isPending}
            aria-label="编辑库存"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground shrink-0"
            onClick={() => adjustStock(1)}
            onMouseDown={handleMouseDown}
            disabled={isPending}
          >
            {" "}
            <Plus className="size-3" />{" "}
          </Button>
          {isPending && (
            <Loader className="absolute -right-5 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
          )}
        </div>
      );
    }

    return (
      <div
        className={cn(
          "text-center font-medium cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded w-fit mx-auto min-h-[28px] flex items-center justify-center",
          (currentValue ?? 0) > 0
            ? "text-green-600 dark:text-green-400"
            : "text-destructive"
        )}
        onClick={() => setIsEditing(true)}
        title="点击编辑库存"
      >
        {currentValue ?? 0}
      </div>
    );
  }
);
EditableStockCell.displayName = "EditableStockCell";

interface ComponentPriceCellProps {
  value: number;
}

// Price Cell (Now Read Only - Edit via Modal)
export const ComponentPriceCell = ({ value }: ComponentPriceCellProps) => {
  // Display mode only
  return (
    <div className="text-right font-mono text-sm whitespace-nowrap">
      {toEUR(value)}
    </div>
  );
};

// Add Model Cell back (as non-editable display cell)
export const ComponentModelCell = ({
  row,
}: CellContext<Component, unknown>) => {
  const models = row.original.model;
  const name = row.original.name;

  if (!models || models.length === 0) {
    // Use secondary badge for "通用"
    return (
      <Badge variant="secondary" className="text-xs">
        通用
      </Badge>
    );
  }

  return (
    <div className="flex items-center flex-wrap gap-1 max-w-[200px]">
      <Badge variant="outline" className="text-xs">
        {models[0]}
      </Badge>
      {models.length > 1 && (
        <LazyShowMoreModelButton models={models} name={name} />
      )}
    </div>
  );
};

// Lazy import ShowMoreModelButton
const LazyShowMoreModelButton = dynamic(
  () =>
    import("@/views/component/components/show-more-model-button").then(
      (mod) => mod.ShowMoreModelButton
    ),
  { loading: () => <Skeleton className="h-6 w-8" />, ssr: false } // Adjust skeleton
);
