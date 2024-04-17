import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Repair } from "@prisma/client";
import dayjs from "dayjs";

export default async function ShowRepairData({
  customerId,
}: {
  customerId: number;
}) {
  const res = await fetch(`/api/v1/customers/${customerId}`);

  const data = await res.json();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">手机型号</TableHead>
          <TableHead>问题</TableHead>
          <TableHead>取件时间</TableHead>
          <TableHead className="text-right">金额</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.repairs.length !== 0 ? (
          data.repairs.map((repair: Repair) => (
            <TableRow key={repair.id}>
              <TableCell className="font-medium">{repair.phone}</TableCell>
              <TableCell>{repair.problem.toString()}</TableCell>
              <TableCell>
                {dayjs(repair.updatedAt).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell className="text-right">
                {repair.price.toString()}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell align="center" colSpan={4}>
              暂无维修历史记录
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
