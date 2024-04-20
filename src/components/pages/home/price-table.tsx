"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { addToOrders } from "@/lib/actions/orders";
import { Preventivo } from "@/lib/definitions";
import { toEUR } from "@/lib/utils";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PriceTable({
  priceData,
}: {
  priceData: Preventivo[] | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const goToRepair = async (id: number) => {
    const isAddedToOrder = await addToOrders(id);

    if (isAddedToOrder) {
      toast({
        title: "该配件已出库",
      });
    } else {
      toast({
        title: "该配件出库失败, 记得手动出库哦",
      });
    }
    router.push("/dashboard/repairs/create");
  };

  return (
    <ScrollArea className="mt-3 px-3 min-w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>配件名称</TableHead>
            <TableHead>分类</TableHead>
            <TableHead>品质</TableHead>
            <TableHead>供应商</TableHead>
            <TableHead>库存</TableHead>
            <TableHead>报价</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {priceData ? (
            priceData.map((data) => (
              <TableRow key={data.id}>
                <TableCell>{data.name}</TableCell>
                <TableCell>{data.category}</TableCell>
                <TableCell>{data.quality}</TableCell>
                <TableCell>
                  {_.isString(data.supplier) ? (
                    data.supplier
                  ) : data.supplier.site ? (
                    <Link
                      href={data.supplier.site}
                      className="text-blue-500"
                      target="_blank"
                    >
                      {data.supplier.name}
                    </Link>
                  ) : (
                    data.supplier.name
                  )}
                </TableCell>
                <TableCell>{data.stock > 0 ? "有货" : "需要预订"}</TableCell>
                <TableCell>{toEUR(data.public_price)}</TableCell>
                <TableCell className="text-right">
                  {data.stock > 0 ? (
                    <Button onClick={() => goToRepair(data.id)}>去维修</Button>
                  ) : _.isString(data.supplier) ? (
                    <Button variant="secondary" disabled>
                      不可用
                    </Button>
                  ) : data.supplier.site ? (
                    <Button asChild variant="secondary">
                      <Link href={data.supplier.site}>去采购</Link>
                    </Button>
                  ) : (
                    <Button variant="secondary" disabled>
                      不可用
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                找不到该手机型号的报价, 过段时间再试
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
