"use client";

import type { SellStock } from "@/lib/types";
import type { SellStockSearch } from "../schema/sell.schema";
import type { BreadCrumbType } from "@/components/breadcrumb";
import { useCallback, useEffect, useState } from "react";
import { fetchSellStockItemsWithPage } from "../api/sell_stock_admin";
import { toast } from "sonner";
import BreadCrumb from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";
import { Separator } from "@/components/ui/separator";
import { SellStockTable } from "./sell_stock_table";
import { CreateSellableItem } from "./create_sellable_item";
import { useRouter } from "next/navigation";

// --- Breadcrumb Items ---
const breadcrumbItems: BreadCrumbType[] = [
  { title: "可售配件管理", link: "/dashboard/sell-stock" },
];

interface SellStockPageProps {
  params: SellStockSearch;
  initialData: SellStock[];
  initialTotalPage: number;
}

const SellStockPage = ({
  params,
  initialData,
  initialTotalPage,
}: SellStockPageProps) => {
  const router = useRouter();
  // --- State Management ---
  const [data, setData] = useState<SellStock[]>(initialData ?? []);
  const [totalPage, setTotalPage] = useState(initialTotalPage ?? 0); // Total row count for pagination
  const [isLoading, setIsLoading] = useState(false); // Initial load from server, client fetch starts false

  // Fetch table data based on search params
  const loadData = useCallback(async (currentSearch: SellStockSearch) => {
    setIsLoading(true);

    try {
      // Fetch data and count based on current search params
      const initialData = await fetchSellStockItemsWithPage(currentSearch);
      setData(initialData.data ?? []);
      setTotalPage(initialData.totalPage ?? 0);
    } catch (err) {
      const errMsg = (err as Error).message || "无法加载可售配件列表，请重试。";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(params);
  }, [params, loadData]);

  const handleActionSuccess = useCallback(() => {
    router.refresh();
  }, []);

  return (
    <div className="flex-1 space-y-4 pt-6 p-4 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <Header
        title="可售配件管理"
        description="管理前台销售的配件库存、价格等信息。"
      >
        <CreateSellableItem />
      </Header>
      <Separator />

      {/* DataTable for Sellable Items */}
      <SellStockTable
        data={data}
        count={totalPage}
        isLoading={isLoading}
        onSuccessAction={handleActionSuccess}
      />
    </div>
  );
};

export default SellStockPage;
