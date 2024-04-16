"use server";

import { revalidatePath } from "next/cache";
import { CrawlBrandData } from "../definitions";
import prisma from "../prisma";

export async function importBrandAndPhone(data: CrawlBrandData[]) {
  try {
    for (const item of data) {
      if (!item.brandName) continue;

      const isExists = await prisma.brand.exists(item.brandName);

      if (isExists) {
        // 如果该品牌已存在
        // 更新该品牌的手机型号
        // 过滤该品牌的手机型号, 看是否存在同样的型号
        const filteredPhones = [];
        for (const model of item.models) {
          const isExistsPhone = await prisma.phone.exists(model.name ?? "");

          if (isExistsPhone) {
            continue;
          }

          filteredPhones.push(model);
        }

        const finalPhones = filteredPhones.map((item) => ({
          name: item.name!,
          isTablet: item.isTablet ?? false,
        }));

        const res = await prisma.brand.update({
          where: {
            name: item.brandName,
          },
          data: {
            phones: {
              createMany: {
                data: finalPhones,
              },
            },
          },
          include: {
            phones: true,
          },
        });
      } else {
        const filteredPhones = item.models.map((item) => ({
          name: item.name!,
          isTablet: item.isTablet ?? false,
        }));

        const res = await prisma.brand.create({
          data: {
            name: item.brandName,
            phones: {
              createMany: {
                data: filteredPhones,
              },
            },
          },
          include: {
            phones: true,
          },
        });
      }
    }

    revalidatePath("/dashboard/phones", "page");
    revalidatePath(`/dashboard/phones/[brandId]`, "page");
    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
}
