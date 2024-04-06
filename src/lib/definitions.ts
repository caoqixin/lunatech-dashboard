import { Prisma } from "@prisma/client";

export type RepiarWithCustomer = Prisma.RepairGetPayload<{
  include: { customer: true };
}>;

export type WarrantyWithRepair = Prisma.WarrantyGetPayload<{
  include: { repair: { include: { customer: true } } };
}>;
