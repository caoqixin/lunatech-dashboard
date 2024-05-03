"use client";
import { CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { FormControl } from "./form";
import { useEffect, useState } from "react";
import { Badge } from "./badge";

export interface Option {
  id: string;
  name: string;
  [key: string]: string | number | boolean | undefined;
}

interface MultiSelectProps {
  options: Option[] | null | undefined;
  placeholder: string;
  fieldName: string;
  defaultValues: string[];
  disabled?: boolean;
  setField: (field: string, data: string[]) => void;
}

export default function MultiSelect({
  options,
  placeholder,
  fieldName,
  defaultValues,
  disabled,
  setField,
}: MultiSelectProps) {
  const values = !Array.isArray(defaultValues)
    ? (defaultValues as string).split(",")
    : defaultValues;

  const [selectedValues, setSelectedValues] = useState<string[]>(values);

  useEffect(() => {
    setField(fieldName, selectedValues);
  }, [selectedValues]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className="h-8"
            disabled={disabled}
          >
            {selectedValues.length <= 0
              ? placeholder
              : selectedValues.map((selectedValue, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValue}
                  </Badge>
                ))}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>暂无数据</CommandEmpty>
            <CommandGroup>
              {options &&
                options.map((option) => {
                  const isSelected = selectedValues.find(
                    (value) => value == option.name
                  );
                  return (
                    <CommandItem
                      value={option.name}
                      key={option.id}
                      onSelect={() => {
                        if (isSelected) {
                          const newSelectedValues = selectedValues.filter(
                            (value) => value != option.name
                          );

                          setSelectedValues(newSelectedValues);
                        } else {
                          const newSelectedValues = [
                            ...selectedValues,
                            option.name,
                          ];
                          setSelectedValues(newSelectedValues);
                        }
                      }}
                    >
                      {option.name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedValues.find((value) => value == option.name)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
