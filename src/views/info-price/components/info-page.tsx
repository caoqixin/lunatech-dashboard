"use client";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { debounce } from "lodash";
import { Component, Phone } from "@/lib/types";
import { Navbar } from "@/components/layout/navbar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchPhonesByName } from "@/views/phones/api/phone";
import { fetchComponentsByPhoneName } from "@/views/component/api/component";
import {
  CheckCircle,
  Loader,
  Search,
  Filter,
  X,
  ShoppingBasket,
  ShoppingBag,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { gotoRepair } from "../api/price";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InfoTable from "./info-table";
import { Button } from "@/components/ui/button";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { cn } from "@/lib/utils";

export const InfoPage = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState(""); // 用于 Input 显示的值

  const [isFocus, setIsFocus] = useState(false);
  const [isLoadingPhones, setIsLoadingPhones] = useState(false);

  const [phones, setPhones] = useState<Phone[] | null>(null);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null); // 初始化为 null
  const [components, setComponents] = useState<Component[] | null>(null);
  const [isLoadingComponents, setIsLoadingComponents] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [checkedCategories, setCheckedCategories] = useState<Set<string>>(
    new Set()
  );

  // 防抖函数，用于延迟触发搜索
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      // 仅在值非空时设置 query 以触发搜索
      if (value.trim()) {
        setQuery(value);
        setSelectedPhone(null); // 清除之前的选择
        setComponents(null); // 清除旧配件
        setCheckedCategories(new Set()); // 清除分类筛选
      } else {
        setQuery(""); // 清空查询
        setPhones(null); // 清空手机列表
      }
      setIsLoadingPhones(false); // 确保 loading 结束
    }, 300), // 300ms 延迟
    []
  );

  // 输入框值变化时更新 inputValue 并触发防抖搜索
  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      setIsLoadingPhones(true); // 开始加载状态
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  // 选择手机型号
  const handleSelectPhone = useCallback((phoneName: string) => {
    setQuery(""); // 清空搜索查询
    setPhones(null); // 隐藏搜索结果列表
    setSelectedPhone(phoneName); // 设置选中的手机
    setInputValue(phoneName); // 更新输入框显示的值
    setIsFocus(false); // 失去焦点
  }, []);

  // 点击跳转到维修页面
  const handleClickRepair = useCallback(
    async (item: Component) => {
      // 这里可能需要更复杂的状态管理或参数传递
      // 暂时假设 gotoRepair 能处理
      await gotoRepair(JSON.stringify(item));
      // 跳转到维修管理页面，可能需要带上参数？
      router.push("/dashboard/repairs");
    },
    [router]
  );

  // 切换分类筛选
  const toggleCategory = useCallback((category: string, state: boolean) => {
    setCheckedCategories((prev) => {
      const updated = new Set(prev);
      state ? updated.add(category) : updated.delete(category);
      return updated;
    });
  }, []);

  // 清除所有分类筛选
  const clearFilters = useCallback(() => {
    setCheckedCategories(new Set());
  }, []);

  // 获取手机列表 Effect
  useEffect(() => {
    let isActive = true;
    setIsLoadingPhones(true);

    async function getPhones(value: string) {
      try {
        const data = await fetchPhonesByName(value);
        if (isActive) {
          setPhones(data.length > 0 ? data : null);
        }
      } catch (error) {
        console.error("Failed to fetch phones:", error);
        if (isActive) setPhones(null);
      } finally {
        if (isActive) setIsLoadingPhones(false);
      }
    }

    if (query) {
      getPhones(query);
    } else {
      setIsLoadingPhones(false); // 如果 query 为空，停止加载
    }

    return () => {
      isActive = false;
      debouncedSearch.cancel();
    }; // 清理 Effect
  }, [query, debouncedSearch]);

  // 获取配件列表 Effect
  useEffect(() => {
    let isActive = true;

    async function getComponents(phone: string) {
      setIsLoadingComponents(true);
      setErrorMsg("");
      setComponents(null); // 清空旧数据
      try {
        const data = await fetchComponentsByPhoneName(phone);
        if (isActive) {
          setComponents(data);
        }
      } catch (error) {
        console.error("Failed to fetch components:", error);
        if (isActive) {
          setErrorMsg("获取配件信息失败，请稍后重试。");
          setComponents(null); // 确保出错时列表为空
        }
      } finally {
        if (isActive) setIsLoadingComponents(false);
      }
    }

    if (selectedPhone) {
      getComponents(selectedPhone);
    } else {
      setComponents(null); // 如果没有选中手机，清空配件列表
    }

    return () => {
      isActive = false;
    }; // 清理 Effect
  }, [selectedPhone]);

  // 计算可用分类
  const categories = useMemo(() => {
    if (!components) return [];
    // 使用 Set 去重并排序
    return Array.from(new Set(components.map((c) => c.category))).sort();
  }, [components]);

  // 根据筛选过滤配件
  const filteredComponents = useMemo(
    () =>
      components?.filter(
        (component) =>
          checkedCategories.size === 0 ||
          checkedCategories.has(component.category)
      ) || [],
    [components, checkedCategories]
  );

  return (
    // 使用 bg-background 保持主题一致性
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* 假设此页面独立于 Dashboard 布局，需要自己的 Navbar */}
      {/* 如果是在 Dashboard 内部，移除这个 Navbar */}
      <Navbar
        showBackButton={true}
        customComponents={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              router.push("/sell");
            }}
            className="flex items-center gap-2"
          >
            <ShoppingBag className="size-4" />
            销售单
          </Button>
        }
      />

      {/* 主内容区域，使用更一致的内边距 */}
      <div className="container mx-auto flex-1 px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        {/* 搜索卡片 */}
        <Card className="mb-6 overflow-visible">
          {" "}
          {/* overflow-visible 允许 CommandList 溢出 */}
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Search className="size-5 text-primary" />
              <span>维修价格查询</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Relative container for positioning context */}
            <div className="relative">
              {/* Command component wraps EVERYTHING related to the command functionality */}
              {/* Added overflow-visible to prevent clipping the absolute CommandList */}
              <Command
                shouldFilter={false}
                className="relative overflow-visible rounded-lg border shadow-sm" // Add relative here too, Command itself can be the context
              >
                <CommandInput
                  placeholder="输入手机型号开始搜索..."
                  value={inputValue}
                  onValueChange={handleInputChange}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setTimeout(() => setIsFocus(false), 150)}
                  className="h-11 text-base pr-10" // Padding for the icon
                />
                {/* Status Icon: Absolutely positioned relative to Command */}
                <div className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
                  {isLoadingPhones && !selectedPhone && (
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  )}
                  {selectedPhone && !isLoadingPhones && (
                    <CheckCircle className="size-5 text-green-500" />
                  )}
                </div>

                {/* CommandList is NOW INSIDE Command again */}
                {/* Conditional rendering based on focus and state */}
                {isFocus &&
                  (inputValue || phones || isLoadingPhones) &&
                  !selectedPhone && (
                    <CommandList
                      // Apply positioning and styling directly to CommandList
                      className={cn(
                        "absolute z-20 w-full rounded-md border bg-popover p-1 shadow-lg",
                        // Use top positioning relative to the Command container
                        // h-11 input (44px) + ~6px gap = 50px
                        "top-[50px]", // Adjust this value if needed (e.g., top-[48px] or top-[52px])
                        "max-h-60 overflow-auto" // Height and scroll
                      )}
                      style={{ maxHeight: "15rem" }} // Explicit max-height
                    >
                      {/* Loading state */}
                      {isLoadingPhones && (
                        <div className="flex items-center justify-center px-3 py-2 text-sm text-muted-foreground">
                          <Loader className="mr-2 size-4 animate-spin" />
                          搜索中...
                        </div>
                      )}
                      {/* Empty state */}
                      {!isLoadingPhones && !phones && query && (
                        <CommandEmpty className="py-4 text-center text-sm">
                          未找到与 "{query}" 匹配的手机型号
                        </CommandEmpty>
                      )}
                      {/* Results */}
                      {!isLoadingPhones &&
                        phones?.map((phone) => (
                          <CommandItem
                            key={phone.id}
                            value={phone.name}
                            onSelect={() => handleSelectPhone(phone.name)}
                            className="cursor-pointer rounded-sm px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent aria-selected:text-accent-foreground"
                          >
                            {phone.name}
                          </CommandItem>
                        ))}
                    </CommandList>
                  )}
              </Command>{" "}
              {/* End of Command Component */}
            </div>{" "}
            {/* End of relative container */}
            {/* Selected phone info (outside the relative container is fine) */}
            {selectedPhone && (
              <p className="mt-2 text-sm text-muted-foreground">
                已选择型号:{" "}
                <span className="font-medium text-foreground">
                  {selectedPhone}
                </span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* 结果区域: 仅当选择了手机后显示 */}
        {selectedPhone && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            {/* 分类筛选卡片 (左侧) */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg font-medium">
                    <Filter className="size-4" />
                    配件分类
                  </CardTitle>
                  {/* 清除筛选按钮 */}
                  {checkedCategories.size > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs"
                    >
                      清除筛选
                      <X className="ml-1 size-3" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {isLoadingComponents && (
                    <SkeletonWrapper count={4} variant="line" className="h-6" />
                  )}
                  {!isLoadingComponents && categories.length === 0 && (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      暂无分类信息
                    </p>
                  )}
                  {!isLoadingComponents && categories.length > 0 && (
                    <div className="space-y-3 pt-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center gap-3">
                          <Checkbox
                            id={`category-${category}`} // 确保 ID 唯一
                            onCheckedChange={(state) =>
                              toggleCategory(category, !!state)
                            }
                            checked={checkedCategories.has(category)}
                            aria-labelledby={`label-${category}`}
                          />
                          <label
                            id={`label-${category}`}
                            htmlFor={`category-${category}`} // 与 Checkbox id 关联
                            className="flex flex-1 cursor-pointer items-center justify-between text-sm"
                          >
                            <span className="truncate pr-2">{category}</span>
                            <Badge variant="secondary" className="shrink-0">
                              {components?.filter(
                                (c) => c.category === category
                              ).length || 0}
                            </Badge>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 配件详情表格 (右侧) */}
            <div className="lg:col-span-9">
              <Card>
                <CardHeader>
                  {/* 标题显示选中的手机型号 */}
                  <CardTitle>
                    配件列表:{" "}
                    <span className="font-medium text-primary">
                      {selectedPhone}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <InfoTable
                    components={filteredComponents}
                    isLoading={isLoadingComponents}
                    errorMsg={errorMsg}
                    handleClickRepair={handleClickRepair}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        {/* 如果未选择手机，可以显示提示信息 */}
        {!selectedPhone && !isLoadingPhones && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center mt-6">
            <Search className="size-10 mb-4 text-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground">
              请输入手机型号进行查询
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              查询后将在此处显示配件分类和列表。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
