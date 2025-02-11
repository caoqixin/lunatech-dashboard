"use server";
import { unstable_noStore as noStore } from "next/cache";
import { DataReturnType } from "@/lib/definitions";
import { createClient } from "@/lib/supabase/server";
import { SearchWarranty } from "../schema/warranty.schema";
import { RepairWarrantyStatus } from "@/views/repair/schema/repair.schema";
import date from "@/lib/date";

export async function fetchWarranties(params: SearchWarranty) {
  noStore();

  const { page, per_page, contact } = params;
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;
  const supabase = await createClient();

  const query = supabase
    .from("warranties")
    .select(
      `
      *,
      repairs!inner (
        *,
        customers!inner (*)
      )
      `
    )
    .neq("isRework", true)
    .range(from, to);

  if (contact) query.like("repairs.customers.tel", `%${contact}%`);

  const { data } = await query.order("createdAt", { ascending: false });

  return data ?? [];
}

// count how many page have
export async function countWarranties(params: SearchWarranty) {
  noStore();
  const { per_page, contact } = params;

  const supabase = await createClient();

  const query = supabase
    .from("warranties")
    .select(
      `
      *,
      repairs!inner (
        *,
        customers!inner (*)
      )
      `,
      { count: "exact", head: true }
    )
    .neq("isRework", true);

  if (contact) query.like("repairs.customers.tel", `%${contact}%`);

  const { count } = await query;

  return Math.ceil((count ?? 0) / per_page);
}

async function generateId() {
  const supabase = await createClient();

  const prefix = "LUNATECH";
  const year = date().year();
  const month = (date().month() + 1).toString().padStart(2, "0");

  // 获取当前月份已存在的最大序列号
  const { data, error } = await supabase
    .from("warranties")
    .select("id")
    .ilike("id", `${prefix}-${year}-${month}-%`)
    .limit(1)
    .order("id", { ascending: false })
    .maybeSingle();

  if (error) {
    throw new Error("保修ID生成失败");
  }

  // 解析最新序列号
  let sequence = 1; // 默认从 1 开始
  if (data) {
    const latestId = data.id;
    const match = latestId.match(/-(\d{4})$/);
    if (match) {
      sequence = parseInt(match[1], 10) + 1;
    }
  }

  // 拼接新的保修 ID
  const newId = `${prefix}-${year}-${month}-${String(sequence).padStart(
    4,
    "0"
  )}`;
  return newId;
}

export async function reworkWarranty(id: string): Promise<DataReturnType> {
  const supabase = await createClient();

  // 获取count
  const { data: rework } = await supabase
    .from("warranties")
    .select("reworkCount, repairId")
    .eq("id", id)
    .single();

  if (!rework) {
    return {
      msg: `当前保修记录不存在`,
      status: "error",
    };
  }

  const count = rework.reworkCount + 1;

  const { data, error } = await supabase
    .from("warranties")
    .update({
      isRework: true,
      reworkCount: count,
    })
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    return {
      msg: `返修失败, 失败原因: ${error.details}`,
      status: "error",
    };
  }

  await supabase
    .from("repairs")
    .update({
      isRework: true,
      status: RepairWarrantyStatus.REWORKING,
    })
    .eq("id", rework.repairId);

  return {
    msg: `保修ID: ${data.id}正在返修, 前往维修中心查看`,
    status: "success",
  };
}

export async function createWarranty(
  repairId: number
): Promise<DataReturnType> {
  const warrantyID = await generateId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("warranties")
    .insert({
      id: warrantyID,
      repairId,
      createdAt: date().toISOString(),
      expiredAt: date().add(3, "month").toISOString(),
    })
    .select()
    .single();

  if (error) {
    return {
      msg: `保修创建失败, 失败原因:${error.details}`,
      status: "error",
    };
  }

  return {
    msg: `保修创建成功, 到期时间为: ${date(data.expiredAt).format(
      "DD/MM/YYYY"
    )}, 可前往保修中心查看详情`,
    status: "success",
  };
}
