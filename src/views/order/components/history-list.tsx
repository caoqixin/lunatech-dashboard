import { OrderSearch } from "@/views/order/schema/order.schema";
import { countOrders, fetchOrderHistories } from "@/views/order/api/history";
import { HistoryTable } from "./history-table";

interface HistoryListProps {
  params: OrderSearch;
}

export const HistoryList = async ({ params }: HistoryListProps) => {
  const [data, count] = await Promise.all([
    fetchOrderHistories(params),
    countOrders(params.per_page),
  ]);

  return <HistoryTable data={data} count={count} />;
};
