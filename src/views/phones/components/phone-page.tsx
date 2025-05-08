"use client";
import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";
import { Separator } from "@/components/ui/separator";
import type { SearchPhoneParams } from "@/views/phones/schema/phone.schema";
import type { Phone } from "@/lib/types";
import { fetchPhonesByBrand } from "../api/phone";
import { PhoneTable } from "@/views/phones/components/phone-table";
import { CreatePhone } from "@/views/phones/components/create-phone";
import { useState, useEffect, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhonePageProps {
  brandId: string; // Brand ID from URL params
  brandName: string; // Brand Name fetched on server
  search: SearchPhoneParams; // Validated search params from server Page
  initialData: Phone[]; // Initial data fetched on server
  initialTotalPage: number; // Initial count fetched on server
  fetchError: string | null; // Initial fetch error from server
}

export const PhonePage = ({
  brandId,
  brandName,
  search,
  initialData,
  initialTotalPage,
  fetchError,
}: PhonePageProps) => {
  // State for table data, initialized from props
  const [data, setData] = useState<Phone[]>(initialData ?? []);
  const [totalPage, setTotalPage] = useState(initialTotalPage ?? 0);
  const [isLoading, setIsLoading] = useState(false); // Initial load handled by server, start false
  const [error, setError] = useState<string | null>(fetchError); // Initialize with potential server error

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "手机品牌管理", link: "/dashboard/phones" },
    { title: brandName, link: `/dashboard/phones/${brandId}` },
  ];

  // Fetch data based on search params (passed via props)
  const loadData = useCallback(
    async (currentSearch: SearchPhoneParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const brandIdNumber = parseInt(brandId, 10);
        if (isNaN(brandIdNumber)) throw new Error("无效的品牌 ID");

        // Fetch data using the current search params
        const [fetchedData, fetchedTotalPage] = await fetchPhonesByBrand(
          brandIdNumber,
          currentSearch
        );

        setData(fetchedData ?? []);
        setTotalPage(fetchedTotalPage ?? 0);
        setError(null); // Clear error on success
      } catch (err: any) {
        console.error("Failed to load phones:", err);
        const errMsg = err.message || "无法加载手机型号列表，请稍后重试。";
        setError(errMsg);
        setData([]); // Clear data on error
        setTotalPage(0);
      } finally {
        setIsLoading(false);
      }
    },
    [brandId]
  );
  // Effect to reload data if search params from URL change
  useEffect(() => {
    // Reset error and trigger load
    setError(null);
    loadData(search);
  }, [search, loadData]);

  // Callback for successful create/edit/delete actions
  const handleSuccess = useCallback(() => {
    // Refetch data using the current search params
    loadData(search);
    // Or use router.refresh() if preferred
    // router.refresh();
  }, [loadData, search]);

  return (
    <div className="flex-1 space-y-4 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      {/* Pass back prop to Header */}
      <Header title={brandName} back="/dashboard/phones">
        {/* Pass brandId and onSuccess */}
        <CreatePhone
          brandId={brandId}
          brandName={brandName}
          onSuccess={handleSuccess}
        />
      </Header>
      <Separator />
      {/* Display Error */}
      {error && !isLoading && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>加载错误</AlertTitle>
          <AlertDescription>
            {error}{" "}
            <Button
              variant="link"
              size="sm"
              onClick={() => loadData(search)}
              className="p-0 h-auto ml-2"
            >
              重试
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {/* Always render Table, pass loading state */}
      <PhoneTable
        data={data}
        count={totalPage}
        isLoading={isLoading} // Pass loading state
      />
    </div>
  );
};
