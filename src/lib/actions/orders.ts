"use server";
// 出库操作
import redis from "@/lib/redis";
import { OrderComponent, RedisOrderType } from "../definitions";
import { revalidatePath, unstable_noStore } from "next/cache";
import prisma from "../prisma";
import { toEUR } from "../utils";

export async function getValue() {
  await redis.set("name", "qixin");
  const data = await redis.get("name");

  return data;
}

export async function addToOrders(id: number) {
  const component = await prisma.component.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      code: true,
      name: true,
      category: true,
      public_price: true,
    },
  });

  if (!component) return false;

  try {
    await addToDataList({
      ...component,
      stock: 1,
      public_price: component.public_price.toString(),
    });

    return true;
  } catch (error) {
    return false;
  }
}

export async function addToDataList(
  component: OrderComponent & { stock: number }
) {
  unstable_noStore();
  try {
    await redis.hset("orders", {
      [component.id]: component,
    });

    return true;
  } catch (error) {
    return false;
  }
}

export async function getDataList(): Promise<RedisOrderType> {
  unstable_noStore();

  return await redis.hgetall("orders");
}

export async function removeItem(field: string) {
  return await redis.hdel("orders", field);
}

export async function removeAllItem(fields: string[]) {
  try {
    for (let field of fields) {
      await redis.hdel("orders", field);
    }

    return true;
  } catch (error) {
    return false;
  }
}

// decriment component stock ajd create order
async function decrimentStockAndCreateOrder(
  outDatas: (OrderComponent & {
    stock: number;
  })[]
) {
  return await prisma.$transaction(async (tx) => {
    const data = outDatas.map(({ id, stock }) => {
      return {
        id,
        stock,
      };
    });

    for (const { id, stock } of data) {
      await tx.component.update({
        where: { id },
        data: {
          stock: {
            decrement: stock,
          },
        },
      });
    }

    // 订单总金额
    const amount = outDatas.reduce(
      (prev, data) => (prev += data.stock * parseFloat(data.public_price)),
      0
    );

    // 订单项数据
    const creatData = outDatas.map(
      ({ id, name, category, code, public_price, stock }) => {
        return {
          componentId: id,
          code,
          name,
          category,
          public_price,
          count: stock,
        };
      }
    );

    // 创建订单
    const order = await tx.order.create({
      data: {
        amount,
        orderItem: {
          createMany: { data: creatData },
        },
      },
    });

    return order;
  });
}

export async function saveOutData(
  outDatas: (OrderComponent & {
    stock: number;
  })[]
) {
  try {
    // 创建订单
    const order = await decrimentStockAndCreateOrder(outDatas);

    revalidatePath("/dashboard/components", "page");
    return {
      msg: `${order.id} 出库成功, 金额为 ${toEUR(order.amount)}`,
      status: "success",
    };
  } catch (error) {
    return {
      status: "error",
      msg: "出库失败, 请重试",
    };
  }
}

export async function addStock(
  key: string,
  fields: OrderComponent & {
    stock: number;
  }
) {
  // 获取该商品的库存总数
  const component = await prisma.component.findUnique({
    where: {
      id: parseInt(key),
    },
    select: {
      stock: true,
    },
  });
  // 判断库存是否大于实际库存
  if (!component) return;

  if (fields.stock > component.stock) {
    return {
      msg: "增加失败, 数量大于库存数量",
      status: "error",
    };
  } else {
    try {
      await redis.hset("orders", {
        [key]: fields,
      });

      return {
        msg: `数量添加成功`,
        status: "success",
      };
    } catch (error) {
      return {
        msg: `数量添加失败`,
        status: "error",
      };
    }
  }
}
export async function minusStock(
  key: string,
  fields: OrderComponent & {
    stock: number;
  }
) {
  // 获取该商品的库存总数
  const component = await prisma.component.findUnique({
    where: {
      id: parseInt(key),
    },
    select: {
      stock: true,
    },
  });

  // 判断库存是否大于实际库存
  if (!component) return;

  if (fields.stock == 0 || fields.stock < 0) {
    return {
      msg: "减少失败, 数量不能为0或者小于0",
      status: "error",
    };
  }

  if (fields.stock > component.stock) {
    return {
      msg: "减少失败, 数量大于库存数量",
      status: "error",
    };
  } else {
    try {
      await redis.hset("orders", {
        [key]: fields,
      });

      return {
        msg: `数量减少成功`,
        status: "success",
      };
    } catch (error) {
      return {
        msg: `数量减少失败`,
        status: "error",
      };
    }
  }
}
