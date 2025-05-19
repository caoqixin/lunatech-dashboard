import type { SearchParams } from "@/components/data-table/type";
import {
  fetchSellStockItemsWithPage,
  type FetchSellStockItemsWithPage,
} from "@/views/sell_stock/api/sell_stock_admin";
import { isLoggedIn } from "@/server/user";
import { sellSearchSchema } from "@/views/sell_stock/schema/sell.schema";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import SellStockPage from "@/views/sell_stock/components/sell_stock_page";
import SellStockErrorPage from "@/views/sell_stock/components/sell_stock_error_page";

export const metadata: Metadata = {
  title: "前台配件管理",
};

export interface SellStockPageProps {
  searchParams: SearchParams;
}

export default async function Page({ searchParams }: SellStockPageProps) {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  // 添加错误处理，确保搜索参数解析正确
  const searchResult = sellSearchSchema.safeParse(searchParams);

  if (!searchResult.success) {
    redirect("/dashboard/sell-stock");
  }

  const searchData = searchResult.data;

  try {
    // Fetch initial data for the client component
    const initialData = await fetchSellStockItemsWithPage(searchData);

    return (
      <SellStockPage
        params={searchData}
        initialData={initialData.data}
        initialTotalPage={initialData.totalPage}
      />
    );
  } catch (error: any) {
    // console.error("Error fetching initial sellable items:", error);
    return (
      <SellStockErrorPage error={error.message ?? "无法加载可售配件列表."} />
    );
  }
}
