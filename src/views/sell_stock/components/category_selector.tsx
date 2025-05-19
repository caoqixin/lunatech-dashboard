"use client";

import React, { useState, useMemo } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";

import type { UseFormSetValue } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SellableItemCategory } from "@/lib/constants";

interface CategorySelectorProps {
  categories: SellableItemCategory[];
  selectedValue: string;
  fieldName: string;
  setValue: UseFormSetValue<any>;
  placeholder?: string;
  disabled?: boolean;
  tabIndex?: number;
}

export const CategorySelector = ({
  categories,
  selectedValue,
  setValue,
  fieldName,
  placeholder = "选择或搜索分类...", // General placeholder
  disabled = false,
  tabIndex,
}: CategorySelectorProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal",
              !selectedValue && "text-muted-foreground"
            )}
            disabled={disabled}
            tabIndex={tabIndex}
          >
            {selectedValue
              ? categories.find(
                  (value) => value.name.toLowerCase() === selectedValue
                )?.name
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command className="max-h-[200px]">
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandEmpty className="h-20 overflow-y-auto">
            <div className="py-4 text-center text-sm">暂无分类可选择</div>
          </CommandEmpty>
          <CommandList
            className="h-[200px] overflow-y-auto"
            onWheel={(e) => e.stopPropagation()}
          >
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name} // Value used for filtering and selection
                  onSelect={(currentValue: string) => {
                    setValue(
                      fieldName,
                      currentValue === selectedValue ? "" : currentValue,
                      { shouldValidate: true, shouldDirty: true }
                    );
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === category.name.toLowerCase()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {category.zh_alias} ({category.name})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
