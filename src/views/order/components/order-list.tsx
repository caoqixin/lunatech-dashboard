"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { debounce } from "lodash";
import { Component } from "@/lib/types";
import { fetchComponentsByQuery } from "@/views/component/api/component";
import { CommandLoading } from "cmdk";
import { cn, toEUR } from "@/lib/utils";
import { CircleX, Loader, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  checkout,
  getOrderList,
  saveOrderState,
} from "@/views/order/api/order";
import { toast } from "sonner";

export const OrderList = () => {
  const [query, setQuery] = useState("");
  const [components, setComponents] = useState<Component[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState<
    (Component & { quantity?: number })[]
  >([]);
  const [isFocus, setIsFocus] = useState(false);
  const [isLoadingValues, setIsLoadingValues] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  // 防抖处理
  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        setQuery(value);
        // 这里可以添加额外的处理逻辑，比如网络请求
      }, 300), // 防抖延迟 300 毫秒
    []
  );

  const handleQueryChange = useCallback(
    (value: string) => {
      debouncedSetQuery(value);
    },
    [debouncedSetQuery]
  );

  const handleSelectItem = (selectedId: string) => {
    if (components) {
      const selectedComponent = components.find(
        (component) => String(component.id) === selectedId
      );

      if (selectedComponent) {
        // 添加到已选择的值中
        setSelectedValues((prev) => [...prev, selectedComponent]);

        // 从components中移除
        setComponents((prev) =>
          prev
            ? prev.filter((component) => component.id !== selectedComponent.id)
            : null
        );
      }
    }
  };

  const removeItem = (componentToRemove: Component) => {
    // 从 selectedValues 中移除
    setSelectedValues((prev) =>
      prev.filter((item) => item.id !== componentToRemove.id)
    );

    // 重新添加到 components
    setComponents((prev) =>
      prev ? [...prev, componentToRemove] : [componentToRemove]
    );
  };

  useEffect(() => {
    async function getList() {
      try {
        const data = await getOrderList();
        setSelectedValues(data);
      } finally {
        setIsLoadingValues(false);
      }
    }
    // 初始化时从 redis 恢复数据
    getList();
  }, []);

  useEffect(() => {
    async function getComponents(value: string) {
      setIsLoading(true);
      const { data } = await fetchComponentsByQuery(value);

      setComponents(data.length > 0 ? data : null);

      setIsLoading(false);
    }

    if (query) {
      getComponents(query);
    } else {
      setComponents(null);
    }
  }, [query]);

  useEffect(() => {
    if (!isLoadingValues) {
      saveOrderState(JSON.stringify(selectedValues));
    }
  }, [selectedValues, isLoadingValues]);

  const renderTableRow = () => {
    if (isLoadingValues) {
      return (
        <TableRow>
          <TableCell colSpan={7} align="center">
            <Loader className="size-4 animate-spin" /> 列表加载中...
          </TableCell>
        </TableRow>
      );
    }

    if (selectedValues.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center">
            暂无出库配件
          </TableCell>
        </TableRow>
      );
    }

    return selectedValues.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.code}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.category}</TableCell>
        <TableCell>
          <input
            type="number"
            step={"any"}
            value={item.public_price}
            onChange={(e) => {
              const updatedPrice = Math.max(0, parseFloat(e.target.value));
              setSelectedValues((prev) =>
                prev.map((comp) =>
                  comp.id === item.id
                    ? { ...comp, public_price: updatedPrice }
                    : comp
                )
              );
            }}
            className="border rounded p-1 w-14"
          />{" "}
          €
        </TableCell>
        <TableCell className="flex items-center gap-x-2">
          <Plus
            className="size-4 cursor-pointer"
            onClick={() => {
              setSelectedValues((prev) =>
                prev.map((comp) =>
                  comp.id === item.id
                    ? { ...comp, quantity: (comp.quantity || 0) + 1 }
                    : comp
                )
              );
            }}
          />

          <input
            type="number"
            value={item.quantity || 1}
            onChange={(e) => {
              const updatedQuantity = Math.max(1, parseInt(e.target.value, 10));
              setSelectedValues((prev) =>
                prev.map((comp) =>
                  comp.id === item.id
                    ? { ...comp, quantity: updatedQuantity }
                    : comp
                )
              );
            }}
            className="border rounded p-1 w-10"
          />
          <Minus
            className="size-4 cursor-pointer"
            onClick={() => {
              setSelectedValues((prev) =>
                prev.map((comp) =>
                  comp.id === item.id
                    ? {
                        ...comp,
                        quantity: Math.max(1, (comp.quantity || 0) - 1),
                      }
                    : comp
                )
              );
            }}
          />
        </TableCell>
        <TableCell>{toEUR(item.public_price * (item.quantity || 1))}</TableCell>
        <TableCell>
          <Button size="icon" variant="ghost" onClick={() => removeItem(item)}>
            <CircleX className="size-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  const handleChekout = async () => {
    if (selectedValues.length === 0) {
      toast.warning("当前没有可出库的配件，请先添加.");

      return;
    }

    try {
      // 显示加载状态
      setIsChecking(true);

      // 成功处理
      const { msg } = await checkout();
      toast.success(msg);
      // 清空已出库的配件
      setSelectedValues([]);
    } catch (error) {
      if (error instanceof Error) {
        // 如果是标准 Error 对象
        try {
          const parsedError: { message: string; details?: string } = JSON.parse(
            error.message
          );
          toast.error(parsedError.details || parsedError.message);
        } catch {
          toast.error(error.message || "出库过程中出现未知问题.");
        }
      } else {
        // 处理非 Error 类型的异常
        toast.error("出库过程中出现未知问题.");
      }
    } finally {
      // 恢复加载状态
      setIsChecking(false);
    }
  };

  return (
    <>
      <Command shouldFilter={false} className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="输入配件编号或配件名称..."
          onValueChange={handleQueryChange}
          onFocus={() => {
            setIsFocus(true);
          }}
          onBlur={() => {
            setIsFocus(false);
          }}
        />
        <CommandList
          className={cn(
            !isLoading
              ? components && components.length > 7
                ? "h-[200px]"
                : "h-fit"
              : "h-9",
            !isFocus && "hidden"
          )}
        >
          {isLoading && (
            <div className="flex items-center justify-center h-9">
              查询中...
            </div>
          )}
          {!isLoading && query && !components && (
            <div className="h-9 flex items-center justify-center">
              未找到相应的配件
            </div>
          )}
          {!isLoading &&
            components &&
            components.map((component) => (
              <CommandItem
                key={component.id}
                value={String(component.id)}
                className="grid grid-cols-3 font-mono cursor-pointer"
                onSelect={handleSelectItem}
                onMouseDown={(e) => e.preventDefault()}
              >
                <span className="grid grid-cols-1 font-extralight">
                  {component.code}
                </span>
                <span className="grid col-span-2 grid-cols-1 font-bold">
                  {component.name}
                </span>
              </CommandItem>
            ))}
        </CommandList>
      </Command>
      <Table>
        <TableCaption>出库单</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">编号</TableHead>
            <TableHead>名称</TableHead>
            <TableHead>分类</TableHead>
            <TableHead>单价</TableHead>
            <TableHead>数量</TableHead>
            <TableHead>总计</TableHead>
            <TableHead className="text-right">{""}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderTableRow()}</TableBody>
      </Table>
      {selectedValues.length > 0 && (
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>总金额</div>
            <div>
              {selectedValues
                ? toEUR(
                    selectedValues.reduce((prev, item) => {
                      return prev + (item.quantity || 1) * item.public_price; // 计算单个项目的金额并累加
                    }, 0)
                  )
                : toEUR(0)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>操作</div>
            <div>
              <Button disabled={isChecking} onClick={handleChekout}>
                出库
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
