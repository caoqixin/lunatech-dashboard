"use server";

import { unstable_noStore as noStore } from "next/cache";
import { DataReturnType } from "@/lib/definitions";
import { createClient } from "@/lib/supabase/server";
import {
  RepairForm,
  RepairSearch,
  RepairStatus,
  RepairWarrantyStatus,
} from "@/views/repair/schema/repair.schema";
import { toEUR } from "@/lib/utils";
import { RepairWithCustomer } from "@/lib/types";
import { createWarranty } from "@/views/warranty/api/warranty";
import date from "@/lib/date";

export async function fetchRepairs(params: RepairSearch) {
  noStore();
  const { page, per_page } = params;
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;
  const supabase = await createClient();

  const { data } = await supabase
    .from("repairs")
    .select(`*, customers (*)`)
    .neq("status", RepairStatus.TAKED)
    .range(from, to)
    .order("createdAt", { ascending: false });

  return data ?? [];
}

// count how many page have
export async function countRepairs(params: RepairSearch) {
  noStore();
  const { per_page } = params;

  const supabase = await createClient();

  const { count } = await supabase
    .from("repairs")
    .select("*", { count: "exact", head: true })
    .neq("status", RepairStatus.TAKED);

  return Math.ceil((count ?? 0) / per_page);
}

export async function updateRepairStatus(
  id: number,
  newStatus: RepairStatus | RepairWarrantyStatus
): Promise<DataReturnType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("repairs")
    .update({
      status: newStatus,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return {
      msg: `维修状态修改失败, 请重试, 失败原因: ${error.message}`,
      status: "error",
    };
  }

  if (data.isRework && newStatus === RepairWarrantyStatus.TAKED) {
    await supabase
      .from("warranties")
      .update({
        isRework: false,
      })
      .eq("repairId", data.id);

    await supabase
      .from("repairs")
      .update({
        isRework: false,
      })
      .eq("id", id);
    return {
      msg: `维修ID:${data.id}, 成功取机, 当前手机已完成保修`,
      status: "success",
    };
  } else if (newStatus === RepairStatus.TAKED) {
    // 创建保修
    return createWarranty(id);
  } else {
    return {
      msg: `维修ID:${data.id}, 更新成功, 当前的维修状态为${newStatus}`,
      status: "success",
    };
  }
}

export async function createNewRepair(
  formData: RepairForm
): Promise<DataReturnType> {
  const { customerId, phone, problem, status, deposit, price } = formData;

  if (!customerId) {
    return {
      msg: "请先选择用户, 在创建该维修",
      status: "error",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("repairs")
    .insert({
      phone,
      problem,
      status,
      deposit,
      price,
      customerId,
      createdAt: date().toISOString(),
      updatedAt: date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return {
      msg: `维修创建失败, 失败原因: ${error.details}`,
      status: "error",
    };
  }
  return { msg: `创建成功, 维修ID: ${data.id}`, status: "success" };
}

export async function updateRepair(
  formData: RepairForm,
  id: number,
  oldData: RepairWithCustomer
): Promise<DataReturnType> {
  const { customerId, phone, problem, status, deposit, price } = formData;

  if (!customerId) {
    return {
      msg: "请先选择用户, 在更新该维修",
      status: "error",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("repairs")
    .update({
      phone,
      problem,
      status,
      deposit,
      price,
      customerId,
      updatedAt: date().toISOString(),
    })
    .eq("id", id)
    .select("*, customers(name)")
    .single();

  if (error) {
    return {
      msg: `维修更新失败, 失败原因: ${error.details}`,
      status: "error",
    };
  }

  if (customerId !== oldData.customerId) {
    return {
      msg: `客户信息更新成功, 更新为: ${data.customers?.name} , 维修ID: ${id}`,
      status: "success",
    };
  }

  if (toEUR(deposit) != toEUR(oldData.deposit)) {
    return {
      msg: `维修订金变动, 更新为: ${toEUR(deposit)} , 维修ID: ${id}`,
      status: "success",
    };
  }

  if (toEUR(price) != toEUR(oldData.price)) {
    return {
      msg: `维修金额变动, 更新为: ${toEUR(price)} , 维修ID: ${id}`,
      status: "success",
    };
  }

  // 维修状态变动
  if (oldData.isRework && data.status === RepairWarrantyStatus.TAKED) {
    await supabase
      .from("warranties")
      .update({
        isRework: false,
      })
      .eq("repairId", id);
    await supabase
      .from("repairs")
      .update({
        isRework: false,
      })
      .eq("id", id);
    return {
      msg: `维修ID:${id}, 成功取机, 当前手机已完成保修`,
      status: "success",
    };
  } else if (status === RepairStatus.TAKED) {
    // 创建保修
    return createWarranty(id);
  } else {
    return {
      msg: `维修ID:${id}, 更新成功, 当前的维修状态为${status}`,
      status: "success",
    };
  }
}

export async function deleteRepair(id: number): Promise<DataReturnType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("repairs")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      msg: `删除失败, 失败原因: ${error.details}`,
      status: "error",
    };
  }

  return {
    msg: `维修ID: ${data.id} 删除成功`,
    status: "success",
  };
}
