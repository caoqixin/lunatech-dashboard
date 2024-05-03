import { Prisma, Repair } from "@prisma/client";

export type RepiarWithCustomer = Prisma.RepairGetPayload<{
  select: {
    id: true;
    phone: true;
    problem: true;
    status: true;
    createdAt: true;
    updatedAt: true;
    isRework: true;
    customer: true;
  };
}> & { deposit: string; price: string };

export type ClientComponent = {
  model: string[];
  category: string;
  supplier: string;
  brand: string;
  id: number;
  code: string | null;
  name: string;
  alias: string | null;
  quality: string;
  stock: number;
  purchase_price: string;
  public_price: string;
};

export type WarrantyWithRepair = Prisma.WarrantyGetPayload<{
  include: {
    repair: {
      select: {
        id: true;
        phone: true;
        problem: true;
        createdAt: true;
        customer: {
          select: {
            name: true;
            tel: true;
          };
        };
      };
    };
  };
}>;

export type ClientRepiar = {
  id: number;
  phone: string;
  customerId: number;
  problem: string[];
  status: string;
  deposit: string;
  price: string;
  createdAt: Date;
  updatedAt: Date;
  isRework: boolean;
};

export type ViewType = "customers" | "repairs" | "components";

export type PublicPhone = Prisma.PhoneGetPayload<{
  select: { id: true; name: true };
}>;

export type Preventivo = Prisma.ComponentGetPayload<{
  select: {
    id: true;
    name: true;
    category: true;
    quality: true;
    stock: true;
    public_price: true;
  };
}> & {
  supplier:
    | {
        site: string | null;
        name: string;
      }
    | string;
};

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
  brandName?: string;
  models: {
    name?: string;
    isTablet?: boolean;
  }[];
};

export type DataReturnType = {
  msg: string;
  status: "success" | "error";
};
