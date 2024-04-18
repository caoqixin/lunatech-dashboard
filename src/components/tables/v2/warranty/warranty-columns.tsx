"use client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { WarrantyCellAction } from "./action/warranty-cell-action";
import dayjs from "dayjs";
import { WarrantyWithRepair } from "@/lib/definitions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableSearchableColumn } from "../types";

export const warrantyColumns: ColumnDef<WarrantyWithRepair>[] = [
  {
    id: "contact_name",
    header: "联系人",
    cell: ({ row }) => {
      const name = row.original.repair.customer.name;

      return <span>{name}</span>;
    },
  },
  {
    id: "contact_tel",
    header: "联系方式",
    accessorKey: "repair",
    cell: ({ row }) => {
      const tel = row.original.repair.customer.tel;

      return <span>{tel}</span>;
    },
    enableColumnFilter: true,
    filterFn: (row: Row<WarrantyWithRepair>, columnId, filterValue) => {
      if (columnId === "contact_tel") {
        const tel = row.original.repair.customer.tel;
        return tel.includes(filterValue);
      }
      return true;
    },
  },
  {
    id: "phone",
    header: "维修手机",
    cell: ({ row }) => {
      const phone = row.original.repair.phone;

      return <span>{phone}</span>;
    },
  },
  {
    id: "problem",
    header: "维修故障",
    cell: ({ row }) => {
      const problem = row.original.repair.problem;

      return <span>{problem.toString()}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "取机时间",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;

      return <span>{dayjs(createdAt).format("DD/MM/YYYY")}</span>;
    },
  },

  {
    id: "expired",
    header: "保修时间",
    cell: ({ row }) => {
      const startDay = row.original.createdAt;
      const expireDay = dayjs(startDay).add(90, "days").format("DD/MM/YYYY");

      const isExpired = dayjs().isAfter(expireDay);

      return (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger>
              {!isExpired ? "In Garanzia" : "Fuori Garanzia"}
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {!isExpired
                  ? `将于 ${expireDay} 过保`
                  : `已于 ${expireDay} 过保`}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const warranty = row.original;

      return <WarrantyCellAction key={warranty.id} data={warranty} />;
    },
  },
];

export const searchableColumns: DataTableSearchableColumn<WarrantyWithRepair>[] =
  [
    {
      id: "contact_tel",
      placeholder: "输入客户联系方式",
    },
  ];
