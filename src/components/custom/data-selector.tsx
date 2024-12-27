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
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormSetValue } from "react-hook-form";
import { Option } from "./multi-selector";

interface DataSelectorProps {
  options: Option[] | null;
  selectedValue: string | null;
  setValue: UseFormSetValue<any>;
  fieldName: string;
  isLocked?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const DataSelector: React.FC<DataSelectorProps> = ({
  options,
  selectedValue,
  setValue,
  fieldName,
  isLocked = false,
  placeholder,
  disabled,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox-options"
            className={cn(
              "w-full justify-between",
              !selectedValue && "text-muted-foreground"
            )}
            disabled={isLocked || disabled}
          >
            {selectedValue
              ? options &&
                options.find((brand) => brand.name === selectedValue)?.name
              : isLocked
              ? "正在加载数据..."
              : placeholder ?? "选择选项"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput placeholder="搜索品牌..." className="h-9" />
          <CommandList
            className="h-[200px] overflow-y-auto"
            onWheel={(e) => e.stopPropagation()}
          >
            <CommandEmpty>没有找到选项</CommandEmpty>
            <CommandGroup>
              {options &&
                options.map((brand) => (
                  <CommandItem
                    value={brand.name}
                    key={brand.name}
                    onSelect={() => {
                      setValue(
                        fieldName,
                        brand.name === selectedValue ? "" : brand.name
                      );
                    }}
                  >
                    {brand.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        brand.name === selectedValue
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

export default DataSelector;
