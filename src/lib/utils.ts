import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 安全地处理数值，避免NaN、undefined或null值导致的问题
 */
export function safeNumber(value: any, defaultValue: number = 0): number {
  if (value === undefined || value === null || isNaN(value)) {
    return defaultValue;
  }
  return Number(value);
}

export function toString(value: any) {
  return value.toString();
}

export function toEUR(value: any) {
  const num = safeNumber(value);
  return new Intl.NumberFormat("it-IT", {
    currency: "EUR",
    style: "currency",
    minimumFractionDigits: 2,
  }).format(num);
}

/**
 * 安全地计算百分比变化
 * @param current 当前值
 * @param previous 之前值
 * @returns 百分比变化
 */
export function calculatePercentageChange(
  current: number,
  previous: any
): number {
  const safeCurrentValue = safeNumber(current);
  const safePreviousValue = safeNumber(previous);

  if (safePreviousValue === 0) {
    return safeCurrentValue > 0 ? 100 : 0;
  }

  return parseFloat(
    (
      ((safeCurrentValue - safePreviousValue) / safePreviousValue) *
      100
    ).toFixed(1)
  );
}

export function convertCSVtoVCF(csvContent: string) {
  const lines = csvContent.trim().split("\n"); // 按行分割
  const rows = lines.slice(1);
  const vcfEntries = [];

  for (const row of rows) {
    const [id, name, tel, email] = row.split(","); // 按逗号分割行

    // 创建 VCF 格式内容
    const vcfEntry = `
BEGIN:VCARD
VERSION:3.0
N:${name.replace(/"/g, "").replaceAll(" ", ";")}
FN:${name.replace(/"/g, "")}
TEL;CELL;VOICE:${tel}
${email ? `EMAIL;TYPE=INTERNET;TYPE=OTHER:${email}` : ""}
END:VCARD
    `.trim();
    vcfEntries.push(vcfEntry);
  }

  return vcfEntries.join("\n"); // 用空行分隔多个联系人
}
