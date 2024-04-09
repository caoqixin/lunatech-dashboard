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
