import { z } from "zod";

export enum CategoryType {
  REPAIR = "repairs",
  COMPONENT = "components",
}

export const CategorySearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  type: z.nativeEnum(CategoryType).default(CategoryType.REPAIR),
});

export const CategorySchema = z.object({
  name: z.string().min(1, {
    message: "名称不能为空",
  }),
});

export type Category = z.infer<typeof CategorySchema>;

export type CategorySearchParams = z.infer<typeof CategorySearchParamsSchema>;
