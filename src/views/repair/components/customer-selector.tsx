"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useForm, UseFormSetValue } from "react-hook-form";

import { capitalizeName, cn } from "@/lib/utils";
import { Customer } from "@/lib/types";
import { RepairForm } from "@/views/repair/schema/repair.schema";
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
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown, Check, PlusCircle, Loader } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  customerSchema,
  CustomerSchema,
} from "@/views/customer/schema/customer.schema";
import { createCustomerForCreateRepair } from "@/views/customer/api/customer";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

interface CustomerSelectorProps {
  options: Customer[] | null;
  selectedValue: number | null;
  setValue: UseFormSetValue<RepairForm>;
  fieldName: keyof RepairForm;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  onCustomerListChange?: () => void;
}

interface CreateCustomerInlineProps {
  children: React.ReactNode; // The trigger button
  onCreate: (newCustomer: Customer) => void; // Callback with new customer data
}

const CreateCustomerInline: React.FC<CreateCustomerInlineProps> = ({
  children,
  onCreate,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", tel: "", email: "" },
  });
  const {
    formState: { isSubmitting },
    reset,
  } = form;

  const handleDialogChange = (isOpen: boolean) => {
    setDialogOpen(isOpen);
    if (!isOpen) reset();
  };

  const onSubmit = async (values: CustomerSchema) => {
    try {
      const { msg, status, data } = await createCustomerForCreateRepair(values);
      if (status === "success" && data) {
        // 如果提交成功，自动选择新创建的客户
        toast.success(msg);
        onCreate(data); // Pass new customer data back
        handleDialogChange(false); // Close dialog
      } else {
        toast.error(msg || "创建失败");
      }
    } catch (error: any) {
      toast.error(`创建失败: ${error.message || "请重试"}`);
      console.error("Inline Create Customer Error:", error);
    }
  };

  // Prevent popover closing when interacting with dialog
  const stopPropagation = useCallback(
    (handler: React.FormEventHandler<HTMLFormElement>) => {
      return (event: React.FormEvent<HTMLFormElement>) => {
        event.stopPropagation();
        handler(event);
      };
    },
    []
  );

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        {/* Stop propagation on content too */}
        <DialogHeader>
          <DialogTitle>添加新客户</DialogTitle>
          <DialogDescription>快速添加客户信息以便选择。</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          {/* Prevent form submission from closing Popover */}
          <form
            onSubmit={stopPropagation(form.handleSubmit(onSubmit))}
            className="space-y-4"
          >
            {/* Simplified Form Fields */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名称*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>电话*</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={isSubmitting}>
                  取消
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader className="mr-2 size-4 animate-spin" />
                )}
                添加
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const CustomerSelector: React.FC<CustomerSelectorProps> = ({
  options,
  selectedValue,
  setValue,
  fieldName,
  isLoading = true,
  placeholder = "选择客户",
  disabled = false,
  onCustomerListChange,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // 使用 memo 缓存客户列表，避免不必要的重新渲染
  const customerOptions = useMemo(() => options || [], [options]);

  // 过滤后的客户数据
  const filteredOptions = useMemo(() => {
    if (!customerOptions.length) return [];
    if (!query.trim()) return customerOptions;
    // 使用 toLowerCase 进行不区分大小写的搜索
    const lowerQuery = query.toLowerCase();
    return customerOptions.filter(
      (option) =>
        option.name.toLowerCase().includes(lowerQuery) ||
        option.tel.includes(query)
    );
  }, [query, customerOptions]);

  // Find selected customer name for display
  const selectedCustomerDisplay = useMemo(() => {
    return selectedValue
      ? customerOptions.find((option) => option.id === selectedValue)?.name ??
          `ID: ${selectedValue}` // Fallback to ID if name not found
      : null;
  }, [selectedValue, customerOptions]);

  // --- Virtualization Setup ---
  const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef,
    estimateSize: () => 40,
    overscan: 5,
    enabled: open,
  });
  const virtualItems = rowVirtualizer.getVirtualItems();

  // --- End Virtualization ---

  // 使用 useCallback 优化事件处理函数，防止不必要的重新创建
  const handleSelect = useCallback(
    (customerId: number) => {
      // If the same customer is selected, deselect (set to null)
      const newValue = customerId === selectedValue ? null : customerId;
      setValue(fieldName as "customerId", newValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setOpen(false);
      setQuery("");
    },
    [setValue, fieldName, selectedValue]
  );

  // Callback when a new customer is created inline
  const handleCustomerCreated = useCallback(
    (newCustomer: Customer) => {
      handleSelect(newCustomer.id);
      // Trigger parent data refresh maybe?
      onCustomerListChange?.();
    },
    [handleSelect, onCustomerListChange]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox-options"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal", // Use normal font weight
              !selectedValue && "text-muted-foreground"
            )}
            disabled={isLoading || disabled}
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader className="mr-2 size-4 animate-spin" />
                加载中...
              </span>
            ) : selectedCustomerDisplay ? (
              <span className="truncate">{selectedCustomerDisplay}</span>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="搜索客户..."
            className="h-9"
            value={query}
            onValueChange={setQuery}
            autoFocus
          />
          <CommandList>
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                加载客户列表中...
              </div>
            ) : filteredOptions.length === 0 && query ? (
              <CommandEmpty>
                <div className="py-4 text-center text-sm">
                  <p>未找到 "{query}" 相关客户。</p>
                  {/* Inline Customer Creation Trigger */}
                  <CreateCustomerInline onCreate={handleCustomerCreated}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-primary hover:text-primary/90"
                    >
                      <PlusCircle className="mr-1.5 size-4" /> 添加新客户
                    </Button>
                  </CreateCustomerInline>
                </div>
              </CommandEmpty>
            ) : filteredOptions.length === 0 && !query ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                无客户可选。
                <CreateCustomerInline onCreate={handleCustomerCreated}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-primary hover:text-primary/90"
                  >
                    <PlusCircle className="mr-1.5 size-4" /> 添加新客户
                  </Button>
                </CreateCustomerInline>
              </div>
            ) : (
              <div
                ref={setParentRef}
                className="h-[200px] overflow-y-auto relative"
                onWheel={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {virtualItems.map((virtualItem) => {
                    const option = filteredOptions[virtualItem.index];
                    if (!option) return null;
                    const isSelected = option.id === selectedValue;

                    return (
                      <CommandItem
                        key={option.id}
                        value={String(option.id)}
                        onSelect={() => handleSelect(option.id)}
                        className="absolute top-0 left-0 w-full flex items-center justify-between cursor-pointer"
                        style={{
                          transform: `translateY(${virtualItem.start}px)`,
                          height: `${virtualItem.size}px`,
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium truncate">
                            {capitalizeName(option.name)}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground">
                            {option.tel}
                          </span>
                        </div>
                        <Check
                          className={cn(
                            "ml-2 size-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </div>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
