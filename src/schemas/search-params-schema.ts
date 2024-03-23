import { z } from "zod";

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
});

export const searchPhoneParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  name: z.string().optional(),
});

export const searchCustomerParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  tel: z.string().optional(),
});

export const searchWarrantyParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  contact_tel: z.string().optional(),
});

export const searchComponentParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  name: z.string().optional(),
  category: z.string().optional(),
});

export type searchComponentParamsValue = z.infer<
  typeof searchComponentParamsSchema
>;

export type searchParamsValue = z.infer<typeof searchParamsSchema>;
export type searchWarrantyParamsValue = z.infer<
  typeof searchWarrantyParamsSchema
>;
export type searchPhoneParamsValue = z.infer<typeof searchPhoneParamsSchema>;
export type searchCustomerParamsValue = z.infer<
  typeof searchCustomerParamsSchema
>;
