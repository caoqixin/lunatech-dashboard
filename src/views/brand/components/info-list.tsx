"use client";

import { Input } from "@/components/ui/input";
import type { Brand } from "@/lib/types";

import InfoCard from "@/views/brand/components/info-card";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Search, Info } from "lucide-react";

interface InfoListProps {
  initialBrands: Brand[]; // Receive initial data
  onSuccess: () => void; // Callback for child actions
}

export const InfoList = ({ initialBrands, onSuccess }: InfoListProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearchKey = searchParams.get("key") ?? ""; // Get initial search key
  const [searchText, setSearchText] = useState(initialSearchKey);
  const debouncedSearchText = useDebounce(searchText, 300);

  // Store the currently displayed brands
  const [displayedBrands, setDisplayedBrands] = useState(initialBrands);

  // Update URL when debounced search text changes
  const updateQueryParam = useCallback(
    (key: string | null) => {
      // Allow null to remove key
      const params = new URLSearchParams(searchParams.toString());
      if (key === null || key === "") {
        params.delete("key");
      } else {
        params.set("key", key);
      }
      // Use replace to avoid pushing duplicate history entries during typing
      router.replace(`/dashboard/phones?${params.toString()}`, {
        scroll: false,
      });
    },
    [searchParams, router]
  );

  useEffect(() => {
    // Only update URL if debounced value is different from current URL param
    if (debouncedSearchText !== initialSearchKey) {
      updateQueryParam(debouncedSearchText);
    }
  }, [debouncedSearchText, updateQueryParam]);

  // Effect to update displayed brands when initialBrands prop changes (due to page re-fetch)
  useEffect(() => {
    setDisplayedBrands(initialBrands);
  }, [initialBrands]);

  // Update search input text if URL changes externally (e.g., browser back/forward)
  useEffect(() => {
    setSearchText(initialSearchKey);
  }, [initialSearchKey]);

  return (
    <div className="flex flex-col gap-y-5">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="输入品牌名称进行搜索..."
          value={searchText} // Controlled input
          onChange={(e) => setSearchText(e.target.value)} // Update local state immediately
          className="pl-8 h-10" // Padding left for icon
        />
      </div>

      {/* Grid or Message */}
      {displayedBrands.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {displayedBrands.map((brand) => (
            <InfoCard key={brand.id} brand={brand} onSuccess={onSuccess} />
          ))}
        </div>
      ) : (
        // Centered "No Data" message
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center mt-6 min-h-[200px]">
          <Info className="size-10 mb-4 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">
            未找到品牌
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {initialSearchKey
              ? `没有找到与 "${initialSearchKey}" 匹配的品牌。`
              : "当前没有品牌信息，请先添加。"}
          </p>
        </div>
      )}
    </div>
  );
};

export default InfoList;
