"use client";

import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Button } from "@/components/ui/button";
import { OrderItem } from "@/lib/types";
import { Info } from "lucide-react";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toEUR } from "@/lib/utils";

interface OrderItemsInfoProps {
  items: OrderItem[];
  orderId: string;
}

export const OrderItemsInfo = ({ items, orderId }: OrderItemsInfoProps) => {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveModal
      open={open}
      onOpen={setOpen}
      title={`${orderId}出库 详情`}
      triggerButton={
        <Button size="icon" variant="ghost">
          <Info className="size-4" />
        </Button>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">配件名称</TableHead>
            <TableHead className="text-nowrap">配件分类</TableHead>
            <TableHead className="text-nowrap">数量</TableHead>
            <TableHead className="text-nowrap">单价</TableHead>
            <TableHead className="text-right">总价</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-nowrap">{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.count}</TableCell>
              <TableCell>{toEUR(Number(item.public_price))}</TableCell>
              <TableCell className="text-right">
                {toEUR(Number(item.public_price) * item.count)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ResponsiveModal>
  );
};
