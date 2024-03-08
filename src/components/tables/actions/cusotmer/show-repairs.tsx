import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Repair } from "@/lib/definitions";
import { repairs } from "@/lib/placeholder-data";

async function showRepairs(id: number): Promise<Repair[]> {
  setTimeout(() => console.log("loading data..."), 5000);
  return repairs.filter((value) => {
    return value.customerId == id;
  });
}

export default async function ShowRepairData({
  customerId,
}: {
  customerId: number;
}) {
  const repairs = await showRepairs(customerId);

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
        {repairs.map((repair) => (
          <TableRow key={repair.id}>
            <TableCell className="font-medium">{repair.phone}</TableCell>
            <TableCell>{repair.problem.toString()}</TableCell>
            <TableCell>{repair.updatedAt.toLocaleDateString()}</TableCell>
            <TableCell className="text-right">{repair.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
