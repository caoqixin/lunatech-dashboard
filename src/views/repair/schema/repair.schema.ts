import date from "@/lib/date";
import { z } from "zod";

export enum RepairStatus {
  PENDING = "未维修",
  REPAIRING = "维修中",
  REPAIRED = "已维修",
  TAKED = "已取件",
  NOREPAIREBLE = "无法维修",
}

export enum RepairWarrantyStatus {
  REWORKING = "返修中",
  REWORKED = "返修完成",
  TAKED = "已取件",
}

export const repairSearchSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  // status:
});

export const repairFormSchema = z.object({
  customerId: z.coerce.number().nullable(),
  phone: z.string().min(1, {
    message: "手机型号不能为空",
  }),
  problem: z.array(z.string(), {
    message: "至少选择一个维修故障",
  }),
  status: z.nativeEnum(RepairStatus).default(RepairStatus.PENDING),
  deposit: z.coerce.number().nonnegative({
    message: "订金金额不能为负数",
  }),
  price: z.coerce.number().nonnegative({
    message: "金额不能为负数",
  }),
  createdAt: z.date().default(date().toDate()).optional(),
  updatedAt: z.date().default(date().toDate()).optional(),
});

export type RepairForm = z.infer<typeof repairFormSchema>;

export type RepairSearch = z.infer<typeof repairSearchSchema>;
