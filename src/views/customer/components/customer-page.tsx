"use client";
import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";

import { Separator } from "@/components/ui/separator";
import { SearchCustomer } from "@/views/customer/schema/customer.schema";
import {
  countAllCustomers,
  countCustomers,
  fetchCustomers,
} from "@/views/customer/api/customer";
import { CreateCustomer } from "@/views/customer/components/create-customer";
import { CustomerTable } from "@/views/customer/components/customer-table";
import { ExportCustomerButton } from "@/views/customer/components/export-customer-button";
import type { Customer } from "@/lib/types";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface CustomerPageProps {
  search: SearchCustomer;
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "客户中心", link: "/dashboard/customers" },
];

export const CustomerPage = ({ search }: CustomerPageProps) => {
  const [data, setData] = useState<Customer[]>([]);
  const [count, setCount] = useState(0); // 当前页数据的总数（用于分页）
  const [totalCustomers, setTotalCustomers] = useState(0); // 所有客户的总数（用于导出）
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 使用 useCallback 封装数据获取逻辑
  const loadData = useCallback(async (currentSearch: SearchCustomer) => {
    setIsLoading(true);
    setError(null);

    try {
      // 并行获取当前页数据、当前条件下总数、所有客户总数
      const [fetchedData, fetchedCount, fetchedAllCount] = await Promise.all([
        fetchCustomers(currentSearch),
        // 注意: countCustomers 可能需要根据搜索条件 (如 tel) 过滤
        // 如果 countCustomers 是计算总页数，它应该基于过滤后的结果总数
        // 假设 countCustomers 现在返回过滤后的总数
        countCustomers(currentSearch.per_page, search.tel ?? ""), // 传递完整 search 参数
        countAllCustomers(), // 这个获取所有客户数量，用于导出
      ]);
      setData(fetchedData ?? []); // 确保是数组
      setCount(fetchedCount ?? 0); // 确保是数字
      setTotalCustomers(fetchedAllCount ?? 0); // 确保是数字
    } catch (err) {
      console.error("Failed to load customers:", err);
      setError("无法加载客户数据，请稍后重试。");
      setData([]);
      setCount(0);
      setTotalCustomers(0);
    } finally {
      setIsLoading(false);
    }
  }, []); // useCallback 的依赖为空，因为它只定义函数

  // 使用 useEffect 监听 search prop 的变化来触发数据加载
  useEffect(() => {
    loadData(search);
  }, [search, loadData]); // 依赖 search 和 loadData 函数本身

  // 处理创建/编辑成功后的刷新回调
  const handleSuccess = useCallback(() => {
    // 简单地调用 loadData 重新获取当前页的数据
    loadData(search);
    // 或者使用 router.refresh()，但这会重新运行服务器组件逻辑
    // router.refresh();
  }, [loadData, search]); // 依赖 loadData 和当前的 search

  // --- 渲染逻辑 ---
  return (
    // 移除内边距，由父布局或 page.tsx 的外层 div 控制
    <div className="flex-1 space-y-4 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="客户中心">
        {/* 保持按钮组 */}
        <div className="flex flex-wrap gap-2">
          {" "}
          {/* 使用 flex-wrap */}
          <ExportCustomerButton customerCounts={totalCustomers} />
          <CreateCustomer onSuccess={handleSuccess} />
        </div>
      </Header>
      <Separator />

      {/* 显示错误消息 */}
      {error && !isLoading && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 表格数据传递 */}
      <CustomerTable
        data={data} // 传递当前页数据
        count={count} // 传递用于分页的总数
        isLoading={isLoading} // 传递加载状态
      />
    </div>
  );
};
