import { Prisma } from "@prisma/client";

export type Category = {
  id: number;
  name: string;
};

export type CategoryItem = {
  id: number;
  name: string;
  categoryId: number;
};

export type Supplier = {
  id: number;
  name: string;
  description?: string;
  site?: string;
  username?: string;
  password?: string;
};

export type Brand = {
  id: number;
  name: string;
};

export type Phone = {
  id: number;
  name: string;
  code?: string;
  isTablet: boolean;
  brandId: number;
};

export type Customer = {
  id: number;
  name: string;
  tel: string;
  email?: string;
};

export type Repair = {
  id: number;
  phone: string;
  problem: string[];
  status: "未维修" | "维修中" | "已维修" | "已取件" | "无法维修";
  deposit?: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  customerId: number;
};

export type RepairComponent = {
  id: number;
  code: string;
  name: string;
  alias?: string;
  brand: string;
  model: string[] | string;
  category: string;
  quality:
    | "compatibile"
    | "originale"
    | "hard oled compatibile"
    | "soft oled compatibile"
    | "incell"
    | "service package original"
    | "rigenerato";
  supplier: string;
  stock: string;
  purchase_price: string;
  public_price?: string;
};

export type RepiarWithCustomer = Prisma.RepairGetPayload<{
  include: { customer: true };
}>;

export type WarrantyWithRepair = Prisma.WarrantyGetPayload<{
  include: { repair: { include: { customer: true } } };
}>;
