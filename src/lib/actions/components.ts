"use server";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/prisma";
import { OrderComponent, ProductComponent } from "../definitions";

export async function fetchComponents(
  value: string,
  ids?: number[]
): Promise<OrderComponent[] | null> {
  noStore();

  if (value != "") {
    const data = await prisma.component.findMany({
      where: {
        OR: [
          {
            name: {
              contains: value,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: value,
              mode: "insensitive",
            },
          },
        ],
        NOT: [
          {
            id: {
              in: ids,
            },
          },
        ],
        stock: {
          gt: 0,
        },
      },
      select: {
        id: true,
        code: true,
        name: true,
        category: true,
        public_price: true,
      },
    });

    const components = data.map((value) => {
      return {
        ...value,
        public_price: value.public_price.toString(),
      };
    });

    return components;
  }

  return null;
}

export async function fetchAllComponents(
  value: string,
  ids?: number[]
): Promise<ProductComponent[] | null> {
  noStore();

  if (value != "") {
    const data = await prisma.component.findMany({
      where: {
        OR: [
          {
            name: {
              contains: value,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: value,
              mode: "insensitive",
            },
          },
        ],
        NOT: [
          {
            id: {
              in: ids,
            },
          },
        ],
      },
      select: {
        id: true,
        code: true,
        name: true,
        purchase_price: true,
      },
    });

    const components = data.map((value) => {
      return {
        ...value,
        count: 1,
        purchase_price: value.purchase_price.toNumber(),
      };
    });

    return components;
  }

  return null;
}
