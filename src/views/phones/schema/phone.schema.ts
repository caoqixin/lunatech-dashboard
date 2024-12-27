import { z } from "zod";

export const searchPhoneParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  name: z.string().default(""),
});

export const phoneSchema = z.object({
  name: z.string().min(1, {
    message: "名称不能为空",
  }),
  code: z.string().optional(),
  isTablet: z.boolean().default(false),
});

export type PhoneSchema = z.infer<typeof phoneSchema>;
export type SearchPhoneParams = z.infer<typeof searchPhoneParamsSchema>;
