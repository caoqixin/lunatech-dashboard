"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useForm, UseFormSetValue } from "react-hook-form";

import { cn } from "@/lib/utils";
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
  DialogContent,
  DialogDescription,
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
}

export const CustomerSelector: React.FC<CustomerSelectorProps> = ({
  options,
  selectedValue,
  setValue,
  fieldName,
  isLoading = true,
  placeholder = "选择客户",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [parentElement, setParentElement] = useState<HTMLDivElement | null>(
    null
  );
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

  // 使用 useMemo 避免 dialog 状态变化导致的不必要重新计算
  const selectedCustomer = useMemo(() => {
    return selectedValue
      ? customerOptions.find((option) => option.id === selectedValue)?.name
      : null;
  }, [selectedValue, customerOptions]);

  const form = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      tel: "",
      email: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const rowVirtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentElement,
    estimateSize: () => 40, // 每行的高度
    overscan: 5,
  });

  // 使用 useCallback 优化事件处理函数，防止不必要的重新创建
  const handleSelect = useCallback(
    (id: number) => {
      setValue(fieldName, id === selectedValue ? null : id);
      setOpen(false);
    },
    [setValue, fieldName, selectedValue]
  );

  const onSubmit = async (values: CustomerSchema) => {
    const { msg, status, data } = await createCustomerForCreateRepair(values);
    if (status == "success" && data) {
      // 如果提交成功，自动选择新创建的客户
      setValue(fieldName, data.id); // 自动选择新创建的客户
      toast.success(msg);
      setDialogOpen(false);
      form.reset();
      setOpen(false); // 关闭客户选择器
    } else {
      toast.error(msg);
    }
  };

  const stopPropagation = useCallback(
    (handler: (event: React.SyntheticEvent) => void) => {
      return (event: React.SyntheticEvent) => {
        event.stopPropagation();
        handler(event);
      };
    },
    []
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox-options"
            className={cn(
              "w-full justify-between font-mono",
              !selectedValue && "text-muted-foreground"
            )}
            disabled={isLoading || disabled}
          >
            {selectedCustomer ||
              (isLoading ? "正在加载数据..." : placeholder ?? "选择选项")}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false} className="w-full">
          <CommandInput
            placeholder="搜索客户..."
            className="h-9"
            value={query}
            onValueChange={setQuery}
            autoFocus
          />
          <CommandList className="w-96">
            <CommandEmpty>
              <div className="flex flex-col items-center justify-between space-y-4">
                <span>没有找到结果</span>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex flex-col justify-center items-center mt-4"
                    >
                      <PlusCircle className="size-4 mr-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>新增客户</DialogTitle>
                      <DialogDescription>创建新客户</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        onSubmit={stopPropagation(form.handleSubmit(onSubmit))}
                        className="flex flex-col gap-4"
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2 mx-2">
                              <FormLabel className="text-nowrap min-w-16 text-right">
                                名称
                              </FormLabel>
                              <div className="flex flex-col gap-1 w-full">
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={isSubmitting}
                                    autoComplete="off"
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="tel"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2 mx-2">
                              <FormLabel className="text-nowrap min-w-16 text-right">
                                电话号码
                              </FormLabel>
                              <div className="flex flex-col gap-1 w-full">
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={isSubmitting}
                                    autoComplete="off"
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2 mx-2">
                              <FormLabel className="text-nowrap min-w-16 text-right">
                                邮箱
                              </FormLabel>
                              <div className="flex flex-col gap-1 w-full">
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={isSubmitting}
                                    autoComplete="off"
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex gap-2 items-center"
                        >
                          {isSubmitting && <Loader className="animate-spin" />}
                          添加
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                <span>新增客户</span>
              </div>
            </CommandEmpty>
            {filteredOptions.length > 0 && (
              <div
                ref={setParentElement}
                className="h-[200px] overflow-y-auto relative"
                onWheel={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    position: "relative",
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                    const option = filteredOptions[virtualItem.index];
                    if (!option) return null;

                    return (
                      <CommandItem
                        value={String(option.id)}
                        key={option.id}
                        onSelect={() => handleSelect(option.id)}
                        className="absolute top-0 left-0 w-full"
                        style={{
                          transform: `translateY(${virtualItem.start}px)`,
                          height: `${virtualItem.size}px`,
                        }}
                      >
                        <span className="font-mono">{option.tel}</span>
                        <span className="font-mono ml-2 text-nowrap">
                          {option.name}
                        </span>
                        <Check
                          className={cn(
                            "ml-auto",
                            option.id === selectedValue
                              ? "opacity-100"
                              : "opacity-0"
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
