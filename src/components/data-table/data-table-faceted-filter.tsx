"use client";

import * as React from "react";
import { CheckIcon, PlusCircleIcon, XIcon } from "lucide-react";
import { type Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import type { Option } from "./type";

interface DataTableFacetedFilterProps<TData, TValue> {
  /**
   * 表格列
   */
  column?: Column<TData, TValue>;

  /**
   * 过滤标题
   */
  title?: string;

  /**
   * 过滤选项
   */
  options: Option[];
}

/**
 * 数据表格分面过滤器组件
 * 用于创建多选下拉过滤菜单
 */
export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  // Ensure filter value is always treated as an array
  const filterValue = column?.getFilterValue();
  const selectedValues = new Set(Array.isArray(filterValue) ? filterValue : []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* Use standard outline button */}
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircleIcon className="mr-2 size-4" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} 已选
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start">
        {" "}
        {/* Slightly wider */}
        <Command>
          {/* Optional: Hide input if options list is short */}
          {options.length > 10 && (
            <CommandInput placeholder={title} className="h-9" />
          )}
          <CommandList>
            <CommandEmpty>无结果.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                const count = facets?.get(option.value) ?? 0;

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      // Logic for updating selection remains the same
                      const newSelectedValues = new Set(selectedValues);
                      if (isSelected) {
                        newSelectedValues.delete(option.value);
                      } else {
                        newSelectedValues.add(option.value);
                      }
                      const filterValues = Array.from(newSelectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                    className="cursor-pointer" // Add cursor pointer
                  >
                    <div
                      className={cn(
                        "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                      aria-hidden="true"
                    >
                      <CheckIcon className={cn("size-3")} />
                    </div>
                    {option.icon && (
                      <option.icon
                        className="mr-2 size-4 text-muted-foreground" // Use theme color
                        aria-hidden="true"
                      />
                    )}
                    <span className="flex-1 text-sm truncate">
                      {option.label}
                    </span>{" "}
                    {/* Truncate label */}
                    {facets &&
                      count > 0 && ( // Only show count if > 0
                        <span className="ml-auto flex size-4 items-center justify-center text-xs text-muted-foreground">
                          {count}
                        </span>
                      )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center text-xs text-destructive hover:bg-destructive/10 focus:bg-destructive/10" // Consistent destructive styling
                  >
                    <XIcon className="mr-2 size-3.5" /> {/* Clear icon */}
                    清除筛选
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
