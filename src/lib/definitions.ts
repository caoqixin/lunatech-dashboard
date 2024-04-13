import { Prisma, Repair } from "@prisma/client";

export type RepiarWithCustomer = Prisma.RepairGetPayload<{
  include: { customer: true };
}>;

export type WarrantyWithRepair = Prisma.WarrantyGetPayload<{
  include: { repair: { include: { customer: true } } };
}>;

export interface RepairMonthData {
  jan?: Repair[];
  feb?: Repair[];
  mar?: Repair[];
  apr?: Repair[];
  may?: Repair[];
  jun?: Repair[];
  jul?: Repair[];
  agu?: Repair[];
  sep?: Repair[];
  oct?: Repair[];
  nov?: Repair[];
  dic?: Repair[];
}

export interface Result {
  [key: string]: number | string;
}

export type OrderComponent = {
  id: number;
  code: string | null;
  name: string;
  category: string;
  public_price: string;
};

export type ProductComponent = {
  id: number;
  code: string | null;
  name: string;
  count: number;
  purchase_price: number;
};

export type RedisProductType = Record<string, ProductComponent> | null;

export type RedisOrderType = Record<
  string,
  OrderComponent & { stock: number }
> | null;

export type CrawlBrandData = {
  brandName: string | undefined;
  models: {
    name: string | undefined;
  }[];
};

export type DataReturnType = {
  msg: string;
  status: "success" | "error";
};
