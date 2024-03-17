import { z } from "zod";

export const RepairSchema = z.object({
  name: z.string().min(1, {
    message: "名称不能为空",
  }),
  tel: z.string().min(1, {
    message: "电话号码不能为空",
  }),
  email: z.string().default(""),
  phone: z.string(),
  problem: z.string().array(),
  status: z
    .enum(["未维修", "维修中", "已维修", "已取件", "无法维修"])
    .default("未维修"),
  deposit: z.string(),
  price: z.string(),
  createdAt: z.date().default(new Date()).optional(),
  updatedAt: z.date().default(new Date()).optional(),
});

export type RepairFormValue = z.infer<typeof RepairSchema>;
