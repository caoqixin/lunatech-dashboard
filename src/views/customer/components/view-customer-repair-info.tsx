"use client";

import { RepairInfo } from "@/lib/types";
import { useState } from "react";
import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Button } from "@/components/ui/button";
import { Eye, Loader } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toEUR } from "@/lib/utils";
import dayjs from "dayjs";

interface RepairInfoTableProps {
  repairs: RepairInfo[] | null;
}

const RepairInfoTable = ({ repairs }: RepairInfoTableProps) => {
  const amount = repairs?.reduce((total, repair) => (total += repair.price), 0);
  return (
    <Table>
      <TableCaption>
        总计维修 {repairs?.length} 台手机, 消费金额 {toEUR(amount)}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">手机型号</TableHead>
          <TableHead>维修故障</TableHead>
          <TableHead>取件时间</TableHead>
          <TableHead className="text-right text-nowrap">维修金额</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {repairs ? (
          repairs.map((repair) => (
            <TableRow key={repair.id}>
              <TableCell className="font-medium text-nowrap">
                {repair.phone}
              </TableCell>
              <TableCell className="text-nowrap">{repair.problem}</TableCell>
              <TableCell>
                {dayjs(repair.updatedAt).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell className="text-right font-semibold">
                {toEUR(repair.price)}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              暂无维修记录
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

interface ViewCustomerRepairInfoProps {
  title: string;
  repairInfo: RepairInfo[] | null;
  isLoading: boolean;
  isDropDownMenu?: boolean;
  onClick?: () => void;
}

export const ViewCustomerRepairInfo = ({
  title,
  isLoading,
  repairInfo,
  isDropDownMenu = false,
  onClick,
}: ViewCustomerRepairInfoProps) => {
  const [open, setOpen] = useState(false);

  if (isDropDownMenu) {
    return (
      <ResponsiveModal
        open={open}
        onOpen={setOpen}
        dropdownMenu={isDropDownMenu}
        title={`${title} 的维修记录`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader className="size-5 animate-spin" />
          </div>
        ) : (
          <RepairInfoTable repairs={repairInfo} />
        )}
      </ResponsiveModal>
    );
  }

  return (
    <ResponsiveModal
      open={open}
      onOpen={setOpen}
      width="500"
      triggerButton={
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={onClick}
        >
          <Eye className="size-4" /> 维修记录
        </Button>
      }
      title={`${title} 的维修记录`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader className="size-5 animate-spin" />
        </div>
      ) : (
        <RepairInfoTable repairs={repairInfo} />
      )}
    </ResponsiveModal>
  );
};
