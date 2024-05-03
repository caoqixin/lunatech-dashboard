"use server";

import { revalidatePath, unstable_noStore } from "next/cache";
import { ProductComponent, RedisProductType } from "../definitions";
import redis from "../redis";
import { toEUR } from "../utils";
import prisma from "../prisma";
import { OrderItem } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// 入库操作

// 获取所有的product
export async function getAllProduct(): Promise<RedisProductType> {
  unstable_noStore();

  return await redis.hgetall("products");
}

// 添加
export async function addToProductList(component: ProductComponent) {
  unstable_noStore();
  try {
    await redis.hset("products", {
      [component.id]: component,
    });

    return true;
  } catch (error) {
    return false;
  }
}

export async function changeProductPrice(
  key: string,
  fields: ProductComponent
) {
  if (fields.purchase_price < 0) {
    return {
      msg: "单价修改失败, 不能小于0",
      status: "error",
    };
  }

  try {
    await redis.hset("products", {
      [key]: fields,
    });

    await prisma.component.update({
      where: {
        id: fields.id,
      },
      data: {
        purchase_price: new Decimal(fields.purchase_price),
      },
    });

    revalidatePath("/dashboard/orders");
    return {
      msg: `单价修改成功`,
      status: "success",
    };
  } catch (error) {
    return {
      msg: "单价修改失败",
      status: "error",
    };
  }
}

export async function removeProduct(field: string) {
  return await redis.hdel("products", field);
}

export async function removeAllProduct(fields: string[]) {
  try {
    for (let field of fields) {
      await redis.hdel("products", field);
    }

    return true;
  } catch (error) {
    return false;
  }
}

export async function modifyProductStock(
  key: string,
  fields: ProductComponent
) {
  try {
    await redis.hset("products", {
      [key]: fields,
    });

    return {
      msg: `数量修改成功`,
      status: "success",
    };
  } catch (error) {
    return {
      msg: `数量修改失败`,
      status: "error",
    };
  }
}

async function incrStockAndCreateOrder(data: ProductComponent[]) {
  return await prisma.$transaction(async (tx) => {
    const product = data.map(({ id, count }) => ({
      id,
      stock: count,
    }));

    // 增加库存
    for (const { id, stock } of product) {
      await tx.component.update({
        where: {
          id,
        },
        data: {
          stock: {
            increment: stock,
          },
        },
      });
    }

    //订单总金额
    const amount = data.reduce(
      (prev, item) => (prev += item.count * item.purchase_price),
      0
    );

    const creatData = data.map(({ id, name, code, count, purchase_price }) => ({
      componentId: id,
      code,
      name,
      purchase_price: purchase_price.toString(),
      count,
      status: "in",
    }));

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

export async function saveProductToDatabase(data: ProductComponent[]) {
  try {
    // 创建订单
    const order = await incrStockAndCreateOrder(data);

    revalidatePath("/dashboard/components", "page");
    return {
      msg: `${order.id} 入库成功, 金额为 ${toEUR(order.amount)}`,
      status: "success",
    };
  } catch (error) {
    return {
      status: "error",
      msg: "入库失败, 请重试",
    };
  }
}
