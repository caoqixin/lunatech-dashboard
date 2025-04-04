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
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { fetchPhonesByName } from "@/views/phones/api/phone";
import { fetchComponentsByPhoneName } from "@/views/component/api/component";
import { CheckCircle, Loader, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { gotoRepair } from "../api/price";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InfoTable from "./info-table";

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
  const debouncedSetQuery = useCallback(
    debounce((value: string) => {
      setQuery(value);
    }, 500),
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  const handleQueryChange = useCallback(
    (value: string) => {
      debouncedSetQuery(value);
    },
    [debouncedSetQuery]
  );

  const handleSelect = useCallback((value: string) => {
    setSelectedPhone(value);
    setIsFocus(false);
  }, []);

  const handleClickRepair = useCallback(
    async (item: Component) => {
      await gotoRepair(JSON.stringify(item));
      router.push("/dashboard/repairs");
    },
    [router]
  );

  // Optimize category selection
  const toggleCategory = useCallback((category: string, state: boolean) => {
    setCheckedCategories((prev) => {
      const updated = new Set(prev);
      state ? updated.add(category) : updated.delete(category);
      return updated;
    });
  }, []);

  //  Only fetch phones when there's a query (not on initial load since we have initialPhones)
  useEffect(() => {
    let isActive = true;

    async function getPhones(value: string) {
      setIsLoading(true);
      try {
        const data = await fetchPhonesByName(value);
        if (isActive) {
          setPhones(data.length > 0 ? data : null);
        }
      } catch (error) {
        console.error("Failed to fetch phones:", error);
        if (isActive) {
          setPhones(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    if (query) {
      getPhones(query);
    }

    return () => {
      isActive = false;
    };
  }, [query]);

  useEffect(() => {
    let isActive = true;
    async function getComponents(phone: string) {
      setIsLoadingComponents(true);
      setErrorMsg("");
      try {
        const data = await fetchComponentsByPhoneName(phone);
        if (isActive) {
          setComponents(data);
        }
      } catch (error) {
        console.error("Failed to fetch components:", error);
        if (isActive) {
          setErrorMsg("配件查询失败");
        }
      } finally {
        if (isActive) {
          setIsLoadingComponents(false);
        }
      }
    }

    if (selectedPhone) {
      getComponents(selectedPhone);
    }

    return () => {
      isActive = false;
    };
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

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      <Navbar showBackButton={true} />
      <Separator />

      <div className="container mx-auto px-4 py-6">
        {/* Search Card */}
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

        {/* Results Section */}
        {selectedPhone && (
          <div className="grid grid-cols-12 gap-4">
            {/* Categories Card */}
            <Card className="col-span-12 md:col-span-3">
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
                      onCheckedChange={(state) =>
                        toggleCategory(category, !!state)
                      }
                      checked={checkedCategories.has(category)}
                    />
                    <label
                      htmlFor={category}
                      className="flex items-center space-x-2 cursor-pointer"
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
            {/* Components Card */}
            <Card className="col-span-12 md:col-span-9">
              <CardHeader>
                <CardTitle>{selectedPhone} 的配件详情</CardTitle>
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
        )}
      </div>
    </div>
  );
};
