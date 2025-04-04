"use client";
import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";
import { Separator } from "@/components/ui/separator";
import { RepairSearch } from "@/views/repair/schema/repair.schema";
import { countRepairs, fetchRepairs } from "@/views/repair/api/repair";
import { RepairTable } from "@/views/repair/components/repair-table";
import { CreateRepair } from "@/views/repair/components/create-repair";
import { useCallback, useEffect, useRef, useState } from "react";
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

  // 追踪订阅状态，避免重复订阅
  const isSubscribed = useRef(false);

  // 更新当前参数
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  // 提取加载数据逻辑为可重用的函数
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [data, newCount] = await Promise.all([
        fetchRepairs(paramsRef.current),
        countRepairs(paramsRef.current),
      ]);

      setRepairs(data);
      setCount(newCount);
    } catch (error) {
      console.error("加载数据失败:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 避免重复订阅
    if (isSubscribed.current) return;

    // 设置 Supabase 实时订阅
    const supabase = supabaseRef.current;
    const channel = supabase
      .channel("repairs-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "repairs",
        },
        (payload) => {
          // 当数据变化时直接重新加载数据，无需等待参数变化
          loadData();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          isSubscribed.current = true;
        } else {
          console.error("Supabase 订阅失败:", status);
        }
      });

    // 清理函数
    return () => {
      supabase.removeChannel(channel);
      isSubscribed.current = false;
    };
  }, [loadData]); // 只依赖loadData，确保只设置一次订阅

  // 当参数变化时重新加载数据
  useEffect(() => {
    loadData();
  }, [params, loadData]);

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
