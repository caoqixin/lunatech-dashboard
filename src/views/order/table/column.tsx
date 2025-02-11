"use client";

import { Order } from "@/lib/types";
import { toEUR } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { OrderItemsInfo } from "@/views/order/components/order-items-info";
import date from "@/lib/date";

export const orderHistoryColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: () => <span className="font-semibold text-nowrap">出库ID</span>,
    cell: ({ row, getValue }) => {
      const { order_items } = row.original;
      return (
        <div className="flex gap-x-1 items-center">
          {order_items.length > 0 && (
            <OrderItemsInfo orderId={row.original.id} items={order_items} />
          )}
          <span>{getValue() as string}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <span className="font-semibold text-nowrap">出库时间</span>,
    cell: ({ getValue }) => {
      return <span>{date(getValue() as string).format("DD/MM/YYYY")}</span>;
    },
  },
  {
    accessorKey: "amount",
    header: () => (
      <span className="font-semibold flex justify-end pr-2">出库金额</span>
    ),
    cell: ({ getValue }) => {
      return (
        <span className="flex justify-end font-bold pr-2">
          {toEUR(getValue())}
        </span>
      );
    },
  },
];
