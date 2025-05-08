"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import { ChevronsUpDown, Check, X, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Option {
  id: number;
  name: string;
}

interface MultiSelectorProps {
  options: Option[] | null;
  selectedValues?: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  maxDisplayBadges?: number;
}

const MultiSelector: React.FC<MultiSelectorProps> = ({
  options,
  selectedValues = [],
  onChange,
  placeholder = "请选择...", // Default placeholder
  disabled = false,
  isLoading = false,
  maxDisplayBadges = 1, // Default: Show max 1 badge + count
}) => {
  const [open, setOpen] = useState(false);
  const handleToggle = (value: string) => {
    if (selectedValues) {
      if (selectedValues.includes(value)) {
        onChange(selectedValues.filter((item) => item !== value));
      } else {
        onChange([...selectedValues, value]);
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent popover trigger
    onChange([]);
  };

  // --- Render Trigger Button Content ---
  const renderTriggerContent = () => {
    if (isLoading) {
      return (
        <span className="flex items-center text-muted-foreground text-sm">
          <Loader className="mr-2 size-4 animate-spin" />
          加载中...
        </span>
      );
    }

    const selectedCount = selectedValues.length;

    if (selectedCount === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }

    // Show 1 or 2 badges + count, or just the count
    if (selectedCount > maxDisplayBadges) {
      // Get labels of the first 'maxDisplayBadges' selected items
      const displayItems = selectedValues.slice(0, maxDisplayBadges);
      return (
        <div className="flex items-center gap-1 overflow-hidden">
          {displayItems.map((value) => (
            <Badge
              variant="secondary"
              key={value}
              className="px-1.5 py-0.5 text-xs whitespace-nowrap"
            >
              {value}
            </Badge>
          ))}
          <Badge
            variant="outline"
            className="px-1.5 py-0.5 text-xs whitespace-nowrap text-muted-foreground"
          >
            +{selectedCount - maxDisplayBadges} 更多
          </Badge>
        </div>
      );
    }

    // Show all selected badges if count <= maxDisplayBadges
    return (
      <div className="flex items-center gap-1 overflow-hidden flex-wrap">
        {/* Added flex-wrap */}
        {selectedValues.map((value) => (
          <Badge
            variant="secondary"
            key={value}
            className="px-1.5 py-0.5 text-xs whitespace-nowrap"
          >
            {value}
          </Badge>
        ))}
      </div>
    );
  };

  // --- Render Tooltip Content (all selected items) ---
  const renderTooltipContent = () => {
    if (!selectedValues || selectedValues.length === 0) return null;
    return selectedValues.join(", "); // Simple comma-separated list
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild disabled={disabled || isLoading}>
              <FormControl>
                {/* Set fixed height, adjust padding */}
                <Button
                  variant="outline"
                  role="combobox" // Use standard role
                  aria-expanded={open}
                  className={cn(
                    "w-full h-9 px-3 flex justify-between items-center font-normal", // fixed height h-9, px-3
                    selectedValues.length === 0 && "text-muted-foreground"
                  )}
                  disabled={disabled || isLoading}
                >
                  {/* Use the helper function to render content */}
                  <div className="flex-1 text-left truncate pr-2">
                    {/* Truncate */}
                    {renderTriggerContent()}
                  </div>
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
          </TooltipTrigger>
          {/* Conditionally render Tooltip content */}
          {selectedValues.length > 0 && (
            <TooltipContent side="top" align="start">
              {renderTooltipContent()}
            </TooltipContent>
          )}
        </Tooltip>

        {/* Popover Content remains mostly the same */}
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          {/* Match trigger width */}
          <Command>
            <CommandInput placeholder="搜索..." className="h-9" />
            {/* Header with selected count and clear button */}
            <div className="flex justify-between items-center px-2 py-1.5 border-b">
              <span className="text-xs text-muted-foreground">
                已选 {selectedValues.length} / {options?.length ?? 0} 项
              </span>
              {/* Clear button */}
              {selectedValues.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 text-xs text-muted-foreground hover:text-destructive"
                  onClick={handleClear}
                  disabled={disabled}
                >
                  清空
                  <X className="ml-1 size-3.5" />
                </Button>
              )}
            </div>
            {/* Command List */}
            <CommandList
              className="h-[200px] overflow-y-auto"
              onWheel={(e) => e.stopPropagation()}
            >
              <CommandEmpty>无匹配选项.</CommandEmpty>
              <CommandGroup>
                {(options ?? []).map((option) => {
                  // Handle null options gracefully
                  const isSelected = selectedValues.includes(option.name);
                  return (
                    <CommandItem
                      key={option.id ?? option.name} // Prefer id if available
                      value={option.name} // Use name for filtering
                      onSelect={() => handleToggle(option.name)}
                      className="cursor-pointer flex items-center justify-between text-sm"
                    >
                      <span className="truncate flex-1 pr-2">
                        {option.name}
                      </span>
                      {/* Improved checkmark indicator */}
                      <div
                        className={cn(
                          "flex size-4 items-center justify-center rounded-sm border border-primary shrink-0",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-0" // Keep space but hide if not selected
                        )}
                        aria-hidden="true"
                      >
                        <Check className="size-3" />
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default MultiSelector;
