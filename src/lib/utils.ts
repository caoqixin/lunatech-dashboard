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
