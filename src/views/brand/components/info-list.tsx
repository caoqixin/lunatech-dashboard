"use client";

import { Input } from "@/components/ui/input";
import { Brand } from "@/lib/types";

import InfoCard from "@/views/brand/components/info-card";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface InfoListProps {
  brands: Brand[];
}

export const InfoList = ({ brands }: InfoListProps) => {
  const [searchText, setSearchText] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const debouncedSearchText = useDebounce(searchText, 300);

  const addQueryParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("key", key);

    router.replace(`?${params.toString()}`); // 仅更新查询参数
  };

  useEffect(() => {
    addQueryParam(debouncedSearchText);
  }, [debouncedSearchText]);

  return (
    <div className="flex flex-col gap-y-4">
      <Input
        placeholder="输入要搜索的品牌 ..."
        onChange={(e) => setSearchText(e.target.value)}
      />
      {brands.length > 0 ? (
        <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <InfoCard key={brand.id} brand={brand} />
          ))}
        </div>
      ) : (
        <div className="w-full flex justify-center">暂无数据</div>
      )}
    </div>
  );
};

export default InfoList;
