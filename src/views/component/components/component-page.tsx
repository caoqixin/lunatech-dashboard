"use client";
import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";

import { Separator } from "@/components/ui/separator";
import type { SearchComponent } from "@/views/component/schema/component.schema";
import {
  countComponents,
  fetchComponents,
} from "@/views/component/api/component";
import { ComponentTable } from "@/views/component/components/component-table";
import { fetchComponentCategoryFilterOptions } from "@/views/category/api/component";
import { fetchComponentBrandsFilterOptions } from "@/views/brand/api/brand";
import type {
  DataTableFilterableColumn,
  Option,
} from "@/components/data-table/type";
import type { Component } from "@/lib/types";
import { CreateComponent } from "@/views/component/components/create-component";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ComponentPageProps {
  search: SearchComponent;
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "配件管理", link: "/dashboard/components" },
];

async function fetchFilterOptions(): Promise<{
  categories: Option[];
  brands: Option[];
}> {
  try {
    const [categoryData, brandData] = await Promise.all([
      fetchComponentCategoryFilterOptions(),
      fetchComponentBrandsFilterOptions(),
    ]);
    const categoryOptions =
      categoryData?.map((item) => ({
        label: item.name ?? "",
        value: item.name ?? "",
      })) ?? [];
    const brandOptions =
      brandData?.map((item) => ({
        label: item.name ?? "",
        value: item.name ?? "",
      })) ?? [];
    return { categories: categoryOptions, brands: brandOptions };
  } catch (error) {
    console.error("Failed to fetch filter options:", error);
    // Return empty options on error, maybe show a toast?
    toast.error("无法加载过滤选项。");
    return { categories: [], brands: [] };
  }
}

export const ComponentPage = ({ search }: ComponentPageProps) => {
  // State for table data
  const [data, setData] = useState<Component[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State for filter options
  const [filterOptions, setFilterOptions] = useState<{
    categories: Option[];
    brands: Option[];
  }>({ categories: [], brands: [] });
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  // Fetch filter options once on mount
  useEffect(() => {
    setIsLoadingFilters(true);
    fetchFilterOptions()
      .then((options) => {
        setFilterOptions(options);
        // No need to set filterableColumns state here, useMemo is better
        setIsLoadingFilters(false);
      })
      .catch(() => {
        setIsLoadingFilters(false);
      })
      .finally(() => {
        setIsLoadingFilters(false);
      });
  }, []);

  // Fetch table data based on search params
  const loadTableData = useCallback(async (currentSearch: SearchComponent) => {
    setIsLoading(true);
    setError(null);
    // console.log("Fetching components with:", currentSearch);
    try {
      // Fetch data and count based on current search params
      const [fetchedData, fetchedCount] = await Promise.all([
        fetchComponents(currentSearch),
        countComponents(currentSearch), // Pass search params to count if it filters
      ]);
      setData(fetchedData ?? []);
      setCount(fetchedCount ?? 0);
    } catch (err) {
      console.error("Failed to load components:", err);
      setError("无法加载配件数据，请稍后重试。");
      setData([]);
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to load table data when search params change
  useEffect(() => {
    loadTableData(search);
  }, [search, loadTableData]);

  // Callback for successful actions (create, edit, delete)
  const handleSuccess = useCallback(() => {
    // Refetch data for the current search params
    loadTableData(search);
    // Alternatively: router.refresh(); but less smooth
  }, [loadTableData, search]);

  const filterableColumns = useMemo(
    (): DataTableFilterableColumn<Component>[] => [
      { id: "category", title: "分类", options: filterOptions.categories },
      { id: "brand", title: "品牌", options: filterOptions.brands },
    ],
    [filterOptions]
  );

  return (
    <div className="flex-1 space-y-4 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="配件管理">
        {/* Pass onSuccess to Create component */}
        <CreateComponent onSuccess={handleSuccess} />
      </Header>
      <Separator />

      {/* Show error */}
      {error && ( // Show error only if not loading (to avoid showing error during initial load failure flicker)
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>加载错误</AlertTitle>
          <AlertDescription>
            {error}{" "}
            <Button
              variant="link"
              size="sm"
              onClick={() => loadTableData(search)}
              className="p-0 h-auto ml-2"
            >
              重试
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Pass data, count, filters, and loading state */}
      <ComponentTable
        data={data}
        count={count}
        // Pass filter config, disable filter UI if still loading options
        filterColumn={isLoadingFilters ? undefined : filterableColumns}
        isLoading={isLoading}
        refetchData={handleSuccess}
      />
    </div>
  );
};
