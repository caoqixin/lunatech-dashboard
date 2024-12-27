import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, {
    message: "名称不能为空",
  }),
  tel: z.string().min(1, {
    message: "电话号码不能为空",
  }),
  email: z.string().optional(),
});

export const searchCustomerParams = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  tel: z.string().optional(),
});

export type SearchCustomer = z.infer<typeof searchCustomerParams>;

export type CustomerSchema = z.infer<typeof customerSchema>;
