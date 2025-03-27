"use client";

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
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import { Component, Phone } from "@/lib/types";
import { Navbar } from "@/components/layout/navbar";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn, toEUR } from "@/lib/utils";
import { fetchPhonesByName } from "@/views/phones/api/phone";
import { fetchComponentsByPhoneName } from "@/views/component/api/component";
import { CheckCircle, Loader, Search, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { gotoRepair } from "../api/price";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
export const InfoPage = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const [isFocus, setIsFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phones, setPhones] = useState<Phone[] | null>(null);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [components, setComponents] = useState<Component[] | null>(null);
  const [isLoadingComponents, setIsLoadingComponents] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [checkedCategories, setCheckedCategories] = useState<Set<string>>(
    new Set()
  );

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

  const handleSelect = (value: string) => {
    setSelectedPhone(value);

    setIsFocus(false);
  };

  const handleClickRepair = useCallback(
    async (item: Component) => {
      await gotoRepair(JSON.stringify(item));
      router.push("/dashboard/repairs");
    },
    [router]
  );

  useEffect(() => {
    async function getPhones(value: string) {
      setIsLoading(true);
      try {
        const data = await fetchPhonesByName(value);
        setPhones(data.length > 0 ? data : null);
      } catch (error) {
        console.error("Failed to fetch phones:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (query) {
      getPhones(query);
    } else {
      setPhones(null);
    }
  }, [query]);

  useEffect(() => {
    async function getComponents(phone: string) {
      setIsLoadingComponents(true);
      try {
        const data = await fetchComponentsByPhoneName(phone);
        setComponents(data);
      } catch (error) {
        setErrorMsg("配件查询失败");
      } finally {
        setIsLoadingComponents(false);
      }
    }
    if (selectedPhone) {
      getComponents(selectedPhone);
    }
  }, [selectedPhone]);

  const categories = useMemo(
    () =>
      new Set<string>(components?.map((component) => component.category) || []),
    [components]
  );

  const filteredComponents = useMemo(
    () =>
      components?.filter(
        (component) =>
          checkedCategories.size === 0 ||
          checkedCategories.has(component.category)
      ) || [],
    [components, checkedCategories]
  );

  const renderComponent = () => {
    if (isLoadingComponents) {
      return (
        <div className="h-32 w-full flex items-center justify-center">
          <Loader className="size-6 animate-spin" /> 数据查询中
        </div>
      );
    }

    if (errorMsg) {
      <div className="h-32 w-full flex items-center justify-center">
        {errorMsg}
      </div>;
    }

    if (!components) {
      return;
    }

    const categories = new Set<string>(
      components.map((component) => component.category)
    );

    return (
      <div className="grid grid-cols-12 mt-4 px-4">
        <div className="grid col-span-3">
          {/* components category */}
          <div className="flex flex-col space-y-2">
            {Array.from(categories).map((category) => (
              <div
                key={category}
                className="font-bold flex flex-row items-center space-x-3 space-y-0"
              >
                <Checkbox
                  value={category}
                  onCheckedChange={(state) => {
                    const updatedCategories = new Set(checkedCategories);

                    if (state) {
                      updatedCategories.add(category); // 添加选中类别
                    } else {
                      updatedCategories.delete(category); // 移除取消选中的类别
                    }

                    setCheckedCategories(updatedCategories); // 更新状态
                  }}
                  checked={checkedCategories.has(category)}
                />
                <span>{category}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid col-span-9">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">配件名称</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>品质</TableHead>
                <TableHead>供应商</TableHead>
                <TableHead>库存</TableHead>
                <TableHead>维修价格</TableHead>
                <TableHead className="text-right">{""}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components
                .filter(
                  (component) =>
                    checkedCategories.size === 0 ||
                    checkedCategories.has(component.category)
                )
                .map((component) => (
                  <TableRow key={component.id}>
                    <TableCell>{component.name}</TableCell>
                    <TableCell>{component.category}</TableCell>
                    <TableCell>{component.quality}</TableCell>
                    <TableCell>{component.supplier}</TableCell>
                    <TableCell>
                      {component.stock > 0 ? "有货" : "需要预订"}
                    </TableCell>
                    <TableCell>{toEUR(component.public_price)}</TableCell>
                    <TableCell>
                      {component.stock > 0 ? (
                        <Button onClick={() => handleClickRepair(component)}>
                          去维修
                        </Button>
                      ) : (
                        "需要订购"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      <Navbar showBackButton={true} />
      <Separator />

      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-6 h-6 text-primary" />
              <span>手机配件查询</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Command className="rounded-xl border shadow-md py-2">
              <CommandInput
                placeholder="输入手机型号..."
                onValueChange={handleQueryChange}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setTimeout(() => setIsFocus(false), 200)}
                className="focus:ring-2 focus:ring-primary"
              />
              {selectedPhone && (
                <div className="px-3 py-2 text-sm flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>已选择: {selectedPhone}</span>
                </div>
              )}
              <CommandList
                className={cn(
                  "transition-all duration-300 ease-in-out",
                  !isLoading
                    ? phones && phones.length > 7
                      ? "max-h-[200px] overflow-y-auto"
                      : "max-h-fit"
                    : "h-9",
                  !isFocus && "hidden"
                )}
              >
                {isLoading && (
                  <div className="flex items-center justify-center p-2">
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                    查询中...
                  </div>
                )}
                <CommandEmpty>未找到相应的手机型号</CommandEmpty>
                {!isLoading &&
                  phones?.map((phone) => (
                    <CommandItem
                      key={phone.id}
                      value={phone.name}
                      onSelect={() => handleSelect(phone.name)}
                      className="hover:bg-gray-100 cursor-pointer px-3 py-2"
                    >
                      {phone.name}
                    </CommandItem>
                  ))}
              </CommandList>
            </Command>
          </CardContent>
        </Card>

        {selectedPhone && (
          <div className="grid grid-cols-12 gap-4">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>配件分类</CardTitle>
              </CardHeader>
              <CardContent>
                {Array.from(categories).map((category) => (
                  <div
                    key={category}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Checkbox
                      id={category}
                      onCheckedChange={(state) => {
                        const updatedCategories = new Set(checkedCategories);
                        state
                          ? updatedCategories.add(category)
                          : updatedCategories.delete(category);
                        setCheckedCategories(updatedCategories);
                      }}
                      checked={checkedCategories.has(category)}
                    />
                    <label
                      htmlFor={category}
                      className="flex items-center space-x-2"
                    >
                      <span>{category}</span>
                      <Badge variant="secondary" className="ml-2">
                        {components?.filter((c) => c.category === category)
                          .length || 0}
                      </Badge>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="col-span-9">
              <CardHeader>
                <CardTitle>{selectedPhone} 的配件详情</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingComponents ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader className="w-8 h-8 animate-spin mr-2" />
                    数据查询中...
                  </div>
                ) : errorMsg ? (
                  <div className="flex items-center justify-center h-32 text-red-500">
                    <XCircle className="w-8 h-8 mr-2" />
                    {errorMsg}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>配件名称</TableHead>
                        <TableHead>分类</TableHead>
                        <TableHead>品质</TableHead>
                        <TableHead>供应商</TableHead>
                        <TableHead>库存</TableHead>
                        <TableHead>维修价格</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComponents.map((component) => (
                        <TableRow
                          key={component.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell>{component.name}</TableCell>
                          <TableCell>{component.category}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                component.quality === "高"
                                  ? "default"
                                  : component.quality === "中"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {component.quality}
                            </Badge>
                          </TableCell>
                          <TableCell>{component.supplier}</TableCell>
                          <TableCell>
                            {component.stock > 0 ? (
                              <Badge
                                variant="outline"
                                className="text-green-600"
                              >
                                有货
                              </Badge>
                            ) : (
                              <Badge
                                variant="destructive"
                                className="text-nowrap"
                              >
                                需要预订
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{toEUR(component.public_price)}</TableCell>
                          <TableCell className="text-right">
                            {component.stock > 0 ? (
                              <Button
                                onClick={() => handleClickRepair(component)}
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                              >
                                去维修
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" disabled>
                                需要订购
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
