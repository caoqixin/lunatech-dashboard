import React from "react";
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
import { ChevronsUpDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

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
}

const MultiSelector: React.FC<MultiSelectorProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder,
  disabled,
  isLoading,
}) => {
  const handleToggle = (value: string) => {
    if (selectedValues) {
      if (selectedValues.includes(value)) {
        onChange(selectedValues.filter((item) => item !== value));
      } else {
        onChange([...selectedValues, value]);
      }
    }
  };

  const handleClear = () => {
    onChange([]); // Clear all selected values
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox-multi-selector"
            className={cn(
              "w-full flex justify-between",
              !selectedValues && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            {selectedValues && selectedValues.length > 0 ? (
              selectedValues && selectedValues.length > 3 ? (
                <>
                  {selectedValues?.slice(0, 3).map((value, index) => (
                    <Badge variant="outline" key={index} className="mr-2">
                      {value}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-muted-foreground">
                    +{selectedValues && selectedValues.length - 3}
                  </Badge>
                </>
              ) : (
                selectedValues &&
                selectedValues.map((value, index) => (
                  <Badge variant="outline" key={index} className="mr-2">
                    {value}
                  </Badge>
                ))
              )
            ) : isLoading ? (
              "正在加载数据..."
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput placeholder="搜索..." className="h-9" />
          <div className="flex justify-between items-center px-2 py-1 border-b border-gray-200">
            <span className="text-sm text-muted-foreground">
              {selectedValues && selectedValues.length > 0
                ? `已选中 ${selectedValues && selectedValues.length} 个选项`
                : "未选择任何选项"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={selectedValues?.length === 0}
            >
              清空
              <X className="ml-1 size-4" />
            </Button>
          </div>
          <CommandList
            className="h-[200px] overflow-y-auto"
            onWheel={(e) => e.stopPropagation()}
          >
            <CommandEmpty>没有找到选项.</CommandEmpty>
            <CommandGroup>
              {options &&
                options.map((option) => (
                  <CommandItem
                    value={option.name}
                    key={option.name}
                    onSelect={() => handleToggle(option.name)}
                  >
                    {option.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedValues?.includes(option.name)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelector;
