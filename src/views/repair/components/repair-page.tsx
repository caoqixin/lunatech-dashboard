"use client";
import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";
import { Separator } from "@/components/ui/separator";
import { RepairSearch } from "@/views/repair/schema/repair.schema";
import { countRepairs, fetchRepairs } from "@/views/repair/api/repair";
import { RepairTable } from "@/views/repair/components/repair-table";
import { CreateRepair } from "@/views/repair/components/create-repair";
import { useEffect, useRef, useState } from "react";
import { RepairWithCustomer } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface RepairPageProps {
  params: RepairSearch;
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "维修管理", link: "/dashboard/repairs" },
];

export const RepairPage = ({ params }: RepairPageProps) => {
  const [repairs, setRepairs] = useState<RepairWithCustomer[]>([]);
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 使用 useRef 存储 supabase 客户端，避免每次渲染都创建新客户端
  const supabaseRef = useRef(createClient());
  const paramsRef = useRef(params);

  // 使用字符串形式的 params 作为依赖项，避免对象引用比较
  const paramsString = JSON.stringify(params);
  useEffect(() => {
    // 更新参数引用
    paramsRef.current = params;
    // 加载初始数据函数
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const [data, count] = await Promise.all([
          fetchRepairs(paramsRef.current),
          countRepairs(paramsRef.current),
        ]);

        setRepairs(data);
        setCount(count);
      } catch (error) {
        console.error("加载数据失败:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();

    // 只在组件挂载时订阅一次，避免多次订阅
    const supabase = supabaseRef.current;
    const channel = supabase
      .channel("repairs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "repairs" },
        () => {
          loadInitialData();
        }
      )
      .subscribe();

    // 在组件卸载时取消订阅
    return () => {
      supabase.removeChannel(channel);
    };
  }, [paramsString]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="维修管理">
        <CreateRepair />
      </Header>
      <Separator />
      <RepairTable data={repairs} count={count} isLoading={isLoading} />
    </div>
  );
};
