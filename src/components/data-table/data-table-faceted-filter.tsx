"use client";

import * as React from "react";
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
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
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed bg-white hover:bg-gray-50"
        >
          <PlusCircledIcon className="mr-2 size-4 text-gray-600" />
          {title}
          {selectedValues?.size > 0 && (
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
                    {selectedValues.size} 选中
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
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} className="h-9" />
          <CommandList>
            <CommandEmpty>无匹配选项</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                const count = facets?.get(option.value) ?? 0;

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
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
                    className="flex items-center justify-between py-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex size-4 items-center justify-center rounded-sm border",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-gray-300 opacity-70 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className="size-3.5" aria-hidden="true" />
                      </div>
                      {option.icon && (
                        <option.icon
                          className="mr-1 size-4 text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                      <span className="text-sm">{option.label}</span>
                    </div>
                    {facets && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center text-xs font-medium text-gray-500">
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
                    className="justify-center text-center text-sm font-medium text-red-500 hover:text-red-600"
                  >
                    清除全部
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
