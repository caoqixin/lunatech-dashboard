"use client";
import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";

import type { SupplierSearchParams } from "@/views/supplier/schema/supplier.schema";
import type { Supplier } from "@/lib/types";

import { SupplierTable } from "@/views/supplier/components/supplier-table";
import { CreateSupplier } from "@/views/supplier/components/create-supplier";

import { countSuppliers, fetchSuppliers } from "@/views/supplier/api/supplier";

import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface SupplierPageProps {
  search: SupplierSearchParams;
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "供应商管理", link: "/dashboard/suppliers" },
];

export const SupplierPage = ({ search }: SupplierPageProps) => {
  const router = useRouter();
  const [data, setData] = useState<Supplier[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Pass search params directly to fetch functions
        const [fetchedData, fetchedCount] = await Promise.all([
          fetchSuppliers(search),
          countSuppliers(search.per_page),
        ]);
        setData(fetchedData);
        setCount(fetchedCount);
      } catch (err) {
        console.error("Failed to load suppliers:", err);
        setError("无法加载供应商数据，请稍后重试。");
        setData([]);
        setCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    // Re-fetch when search params change (debouncing handled by useDataTable hook for URL updates)
  }, [search]);

  // Refresh handler
  const handleSuccess = () => {
    const loadData = async () => {
      setIsLoading(true); // Show loading indicator again
      setError(null);
      try {
        const [refetchedData, refetchedCount] = await Promise.all([
          fetchSuppliers(search),
          countSuppliers(search.per_page),
        ]);
        setData(refetchedData);
        setCount(refetchedCount);
      } catch (err) {
        console.error("Failed to reload suppliers:", err);
        setError("无法刷新供应商数据。");
        // Optionally keep stale data or clear: setData([]); setCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  };

  // Handle error state
  if (error && !isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Header title="供应商管理">
          {/* Still show create button even on error? */}
          <CreateSupplier onSuccess={handleSuccess} />
        </Header>
        <Separator />
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="供应商管理">
        {/* Pass success callback */}
        <CreateSupplier onSuccess={handleSuccess} />
      </Header>
      <Separator />
      {/* Pass data and count to table, handle loading via DataTable */}
      <SupplierTable data={data} count={count} isLoading={isLoading} />
    </div>
  );
};
