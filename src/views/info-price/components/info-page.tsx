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
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn, toEUR } from "@/lib/utils";
import { CommandLoading } from "cmdk";
import { fetchPhonesByName } from "@/views/phones/api/phone";
import { fetchComponentsByPhoneName } from "@/views/component/api/component";
import { Loader } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { gotoRepair } from "../api/price";
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

  const handleClickRepair = async (item: Component) => {
    await gotoRepair(JSON.stringify(item));
    router.push("/dashboard/repairs");
  };

  useEffect(() => {
    async function getPhones(value: string) {
      setIsLoading(true);
      const data = await fetchPhonesByName(value);

      setPhones(data.length > 0 ? data : null);

      setIsLoading(false);
    }

    if (query) {
      getPhones(query);
    } else {
      setPhones(null);
    }
  }, [query]);

  useEffect(() => {
    async function getComponents(phone: string) {
      try {
        setIsLoadingComponents(true);
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
    <div className="min-h-screen w-full flex flex-col">
      <div>
        <Navbar
          titleButton={
            <Button asChild>
              <Link href="/dashboard">返回主页</Link>
            </Button>
          }
        />
      </div>
      <Separator className="mt-2" />
      <main className="h-full flex flex-col mt-0">
        <div className="bg-[url('/images/banner.jpg')] bg-cover h-[100px] w-full bg-center" />

        <div className="mt-2">
          <Command
            shouldFilter={false}
            className="rounded-xl border shadow-md mx-auto max-w-2xl"
          >
            <CommandInput
              placeholder="输入手机型号..."
              onValueChange={handleQueryChange}
              onFocus={() => {
                setIsFocus(true);
              }}
              onBlur={() => {
                setIsFocus(false);
              }}
            />
            <span className="px-2 font-bold">已选择内容: {selectedPhone}</span>
            <CommandList
              className={cn(
                !isLoading
                  ? phones && phones?.length > 7
                    ? "h-[200px]"
                    : "h-fit"
                  : "h-9",
                !isFocus && "hidden"
              )}
            >
              {isLoading && (
                <CommandLoading className="flex items-center justify-center h-9">
                  查询中...
                </CommandLoading>
              )}
              {!isLoading && query && !phones && (
                <div className="h-9 flex items-center justify-center">
                  未找到相应的配件
                </div>
              )}
              {!isLoading &&
                phones &&
                phones.map((phone) => (
                  <CommandItem
                    key={phone.id}
                    value={phone.name}
                    onSelect={() => handleSelect(phone.name)}
                    className="grid grid-cols-3 font-mono cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <span className="grid col-span-2 grid-cols-1 font-bold">
                      {phone.name}
                    </span>
                  </CommandItem>
                ))}
            </CommandList>
          </Command>
        </div>
        {renderComponent()}
      </main>
    </div>
  );
};
