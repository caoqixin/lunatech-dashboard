"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { ClientComponent, DataReturnType } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import { searchComponentParamsValue } from "@/schemas/search-params-schema";
import { CategoryItem } from "@prisma/client";
import { Option } from "@/components/tables/v2/types";
import { ComponentFormValue } from "@/schemas/componet-schema";
import { Decimal } from "@prisma/client/runtime/library";

export async function getAllComponents(
  searchParams: searchComponentParamsValue
): Promise<{ pageCount: number; components: ClientComponent[] }> {
  noStore();
  const { per_page, page, category } = searchParams;
  const skip = (page - 1) * per_page;
  const categoryList = category ? category.split(".") : [];
  const name = searchParams.name ?? "";

  if (categoryList.length !== 0) {
    const components = await prisma.component.findMany({
      orderBy: {
        id: "asc",
      },
      where: {
        category: {
          in: categoryList,
        },
        OR: [
          {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      },
      skip,
      take: per_page,
    });

    const total = await prisma.component.count({
      where: {
        category: {
          in: categoryList,
        },
        OR: [
          {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    const pageCount = Math.ceil(total / per_page);

    return {
      components: components.map((component) => ({
        ...component,
        public_price: component.public_price.toString(),
        purchase_price: component.purchase_price.toString(),
      })),
      pageCount,
    };
  } else {
    const components = await prisma.component.findMany({
      orderBy: {
        id: "asc",
      },
      where: {
        OR: [
          {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      },
      skip,
      take: per_page,
    });

    const total = await prisma.component.count({
      where: {
        OR: [
          {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    const pageCount = Math.ceil(total / per_page);

    return {
      components: components.map((component) => ({
        ...component,
        public_price: component.public_price.toString(),
        purchase_price: component.purchase_price.toString(),
      })),
      pageCount,
    };
  }
}

export async function getComponentById(
  id: number
): Promise<ClientComponent | null> {
  noStore();
  const component = await prisma.component.findUnique({
    where: {
      id,
    },
  });

  if (component) {
    return {
      ...component,
      public_price: component.public_price.toString(),
      purchase_price: component.purchase_price.toString(),
    };
  }
  return null;
}

export async function getCategoryForComponent(
  setting_name: string,
  isSelect?: boolean
): Promise<Option[] | null | CategoryItem[]> {
  noStore();
  // 从配置中获取参数
  const categoryApi = await prisma.setting.findUnique({
    where: {
      setting_name,
    },
  });

  if (!categoryApi) return null;

  const categoryApiList = categoryApi.setting_value.split("/");
  const categoryId = parseInt(categoryApiList[categoryApiList.length - 1]);

  const items = await prisma.categoryItem.findMany({
    where: {
      categoryId,
    },
    orderBy: {
      id: "asc",
    },
  });

  if (isSelect) {
    return items;
  }

  return items.map((item) => ({
    label: item.name,
    value: item.name,
  }));
}

export async function createComponent(
  data: ComponentFormValue
): Promise<DataReturnType> {
  const {
    code,
    name,
    alias,
    brand,
    model,
    quality,
    category,
    supplier,
    stock,
    purchase_price,
    public_price,
  } = data;

  try {
    await prisma.component.create({
      data: {
        code,
        name,
        alias,
        brand,
        model,
        quality,
        category,
        supplier,
        stock: parseInt(stock),
        purchase_price: purchase_price,
        public_price: new Decimal(public_price ?? 0),
      },
    });
    revalidatePath("/dashboard/components");
    return { msg: `配件 [${name}] 添加成功`, status: "success" };
  } catch (error) {
    return { msg: `配件 [${name}] 添加失败, 请重试`, status: "error" };
  }
}

export async function updateComponent(
  id: number,
  data: ComponentFormValue
): Promise<DataReturnType> {
  const {
    code,
    name,
    alias,
    brand,
    model,
    quality,
    category,
    supplier,
    stock,
    purchase_price,
    public_price,
  } = data;

  try {
    await prisma.component.update({
      where: {
        id,
      },
      data: {
        code,
        name,
        alias,
        brand,
        model,
        quality,
        category,
        supplier,
        stock: parseInt(stock),
        purchase_price: purchase_price,
        public_price: new Decimal(public_price ?? 0),
      },
    });
    revalidatePath("/dashboard/components");
    return { msg: `配件 [${name}] 资料修改成功`, status: "success" };
  } catch (error) {
    return { msg: `配件 [${name}] 资料修改失败, 请重试`, status: "error" };
  }
}

export async function deleteComponent(
  id: number,
  name: string
): Promise<DataReturnType> {
  try {
    await prisma.component.delete({
      where: { id },
    });
    revalidatePath("/dashboard/components");
    return { msg: `配件 ${name} 删除成功`, status: "success" };
  } catch (error) {
    return { msg: `配件 ${name} 删除失败`, status: "error" };
  }
}
