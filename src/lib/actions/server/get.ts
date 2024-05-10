"use server";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/prisma";
import { Option } from "@/components/ui/multi-select";

export async function getProblems(
  setting_name: string
): Promise<Option[] | null> {
  const problemApi = await prisma.setting.findUnique({
    where: {
      setting_name,
    },
  });

  if (!problemApi) return null;

  const problemApiList = problemApi.setting_value.split("/");
  const categoryId = parseInt(problemApiList[problemApiList.length - 1]);

  const items = await prisma.categoryItem.findMany({
    where: {
      categoryId,
    },
    orderBy: {
      id: "asc",
    },
  });

  return items.map((item) => ({
    ...item,
    id: item.id.toString(),
  }));
}

export async function getBrands() {
  const brands = await prisma.brand.findMany({});

  return brands;
}

export async function getSuppliers() {
  const suppliers = await prisma.supplier.findMany();

  return suppliers;
}

export async function getPhoneByBrandName(name: string) {
  noStore();

  const phones = await prisma.phone.findMany({
    where: {
      brand: {
        name,
      },
    },
  });

  return phones.map((phone) => ({
    id: phone.id.toString(),
    name: phone.name,
  }));
}
