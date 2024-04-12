"use client";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchOrderParamsValue } from "@/schemas/search-params-schema";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function OrderContent({
  children,
  search,
}: {
  children: React.ReactNode;
  search: searchOrderParamsValue;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const stringSearch = search as unknown as Record<string, string>;

  const createQueryString = useCallback(
    (name: string, value: string | undefined) => {
      const params = new URLSearchParams(stringSearch);
      params.set(name, value ?? "");

      return params.toString();
    },
    [stringSearch]
  );

  const [tab, setTab] = useState<string>(search.tab ?? "out");

  // 首次加载
  useEffect(() => {
    const url = `${pathname}?${createQueryString(
      Object.keys(search).toString(),
      tab
    )}`;

    router.replace(url);
  }, []);

  // 当切换tab是变换值
  useEffect(() => {
    const url = `${pathname}?${createQueryString(
      Object.keys(search).toString(),
      tab
    )}`;

    router.replace(url);
  }, [tab]);
  return (
    <>
      <XinHeader title={tab == "out" ? "出库管理" : "入库管理"}>{""}</XinHeader>
      <Separator />
      <div className="flex-1">
        <Tabs
          defaultValue={tab}
          onValueChange={(v) => setTab(v)}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="out">出库管理</TabsTrigger>
            <TabsTrigger value="in">入库管理 </TabsTrigger>
          </TabsList>
          {children}
        </Tabs>
      </div>
    </>
  );
}
