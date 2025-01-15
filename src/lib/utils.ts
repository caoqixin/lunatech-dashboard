import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toString(value: any) {
  return value.toString();
}

export function toEUR(value: any) {
  return new Intl.NumberFormat("it-IT", {
    currency: "EUR",
    style: "currency",
  }).format(parseFloat(value));
}

export function getCurrentMonth() {
  const currentMonth = dayjs().month() + 1;
  const currentYear = dayjs().year();
  const start = new Date(`${currentYear}/${currentMonth}/01`).toISOString();
  const end = new Date(`${currentYear}/${currentMonth}/31`).toISOString();

  return {
    start,
    end,
  };
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
FN:${name.replace(/"/g, "")}
TEL;CELL:${tel}
${email ? `EMAIL:${email}` : ""}
END:VCARD
    `.trim();
    vcfEntries.push(vcfEntry);
  }

  return vcfEntries.join("\n"); // 用空行分隔多个联系人
}
