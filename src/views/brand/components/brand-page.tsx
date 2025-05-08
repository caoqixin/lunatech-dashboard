"use client";
import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";
import { Separator } from "@/components/ui/separator";
import { CreateBrand } from "@/views/brand/components/create-brand";
import { fetchBrands } from "@/views/brand/api/brand";
import { Loader, AlertTriangle } from "lucide-react";
import type { BrandSearch } from "@/views/brand/schema/brand.schema";
import { InfoList } from "./info-list";
import type { Brand } from "@/lib/types";
import { useState, useEffect, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface BrandPageProps {
  searchKey: BrandSearch;
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "手机品牌管理", link: "/dashboard/phones" },
];

export const BrandPage = ({ searchKey }: BrandPageProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch brands based on searchKey prop
  const loadBrands = useCallback(async (key: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchBrands(key); // Pass key directly
      setBrands(data ?? []);
    } catch (err) {
      console.error("Failed to fetch brands:", err);
      setError("无法加载品牌列表，请稍后重试。");
      setBrands([]); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array

  // Effect to load brands when searchKey changes
  useEffect(() => {
    loadBrands(searchKey.key);
  }, [searchKey.key, loadBrands]); // Depend on the key property and load function

  // Refresh handler to pass to children
  const handleSuccess = useCallback(() => {
    loadBrands(searchKey.key); // Refetch with current key
  }, [loadBrands, searchKey.key]);

  return (
    // Removed padding, assuming layout handles it
    <div className="flex-1 space-y-4 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="手机品牌管理">
        {/* Pass onSuccess handler */}
        <CreateBrand onSuccess={handleSuccess} />
      </Header>
      <Separator />

      {/* Handle Loading/Error states */}
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center p-10">
          <Loader className="size-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>加载错误</AlertTitle>
          <AlertDescription>
            {error}{" "}
            <Button
              variant="link"
              size="sm"
              onClick={() => loadBrands(searchKey.key)}
              className="p-0 h-auto ml-2"
            >
              重试
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        // Pass initial data and success handler to InfoList
        <InfoList initialBrands={brands} onSuccess={handleSuccess} />
      )}
    </div>
  );
  ``;
};
