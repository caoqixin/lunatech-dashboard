import { BadgeProps } from "@/components/ui/badge";
import { Qualities } from "@/views/component/schema/component.schema";
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
  if (!csvContent) {
    return ""; // 处理空输入
  }

  // 按行分割，并过滤空行
  const lines = csvContent
    .trim()
    .split("\n")
    .filter((line) => line.trim() !== "");

  if (lines.length <= 1) {
    return ""; // 没有数据行（只有表头或空）
  }

  const rows = lines.slice(1); // 跳过表头
  const vcfEntries: string[] = [];

  for (const row of rows) {
    const columns = [];
    let currentVal = "";
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"' && (i === 0 || row[i - 1] !== "\\")) {
        // 处理引号，忽略转义引号
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        columns.push(
          currentVal.trim().replace(/^"|"$/g, "").replace(/\\"/g, '"')
        ); // 去除首尾引号，处理转义引号
        currentVal = "";
      } else {
        currentVal += char;
      }
    }
    columns.push(currentVal.trim().replace(/^"|"$/g, "").replace(/\\"/g, '"')); // 添加最后一个值

    // 确保有足够列，防止解构错误
    if (columns.length >= 3) {
      const [_id, nameVal, telVal, emailVal] = columns; // 使用不同的变量名

      // 清理和准备数据
      const name = (nameVal ?? "").trim().replace(/"/g, ""); // 移除所有引号
      const tel = (telVal ?? "").trim().replace(/\s+/g, ""); // 移除电话号码中的空格
      const email = (emailVal ?? "").trim();

      if (!name || !tel) {
        console.warn("Skipping row due to missing name or tel:", row);
        continue; // 跳过缺少姓名或电话的行
      }

      // 格式化 N 属性 (姓;名;;;)
      // 简单处理：假设第一个空格前是姓，后面是名
      const nameParts = name.split(" ");
      const lastName = nameParts[0] || name; // 姓
      const firstName = nameParts.slice(1).join(" ") || ""; // 名
      const formattedN = `${lastName};${firstName};;;`;

      // 创建 VCF 条目
      let vcfEntry = `BEGIN:VCARD\nVERSION:3.0\nN:${formattedN}\nFN:${name}\nTEL;TYPE=CELL:${tel}`; // 使用 TYPE=CELL
      if (email) {
        vcfEntry += `\nEMAIL;TYPE=INTERNET:${email}`; // TYPE=INTERNET 更标准
      }
      vcfEntry += "\nEND:VCARD";

      vcfEntries.push(vcfEntry);
    } else {
      console.warn("Skipping malformed CSV row:", row);
    }
  }

  return vcfEntries.join("\n"); // 用空行分隔多个联系人
}

/**
 * 将人名中每个单词的首字母转为大写，其余字母转为小写
 * @param name - 需要处理的字符串，例如 "alub ayaa"
 * @returns 格式化后的字符串，例如 "Alub Ayaa"
 */
export function capitalizeName(name: string): string {
  if (typeof name !== "string") {
    throw new TypeError("Expected a string input");
  }

  return name
    .trim()
    .split(/\s+/)
    .map((word: string) =>
      word.length > 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ""
    )
    .join(" ");
}

// Define return type matching Badge variant + optional className
type QualityStyle = {
  variant: BadgeProps["variant"]; // Use Badge variant type
  className?: string;
  label: string;
};

// --- Helper function for Quality Badges ---
// (Make sure this is defined or imported)
export const getQualityBadgeStyle = (
  quality: string | null | undefined
): QualityStyle => {
  switch (quality) {
    case Qualities.ORIGINALE:
    case Qualities.SERVICE:
      return {
        variant: "outline", // 基础 variant
        className:
          "border-green-600 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-400 font-semibold", // 完全覆盖样式
        label: "原装",
      };
    case Qualities.SOFTOLED:
      return {
        variant: "outline", // 基础 variant
        className:
          "border-blue-600 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold", // 完全覆盖样式
        label: "柔性 OLED",
      };
    case Qualities.HARDOLED:
      return {
        variant: "outline", // 基础 variant
        className:
          "border-purple-600 bg-purple-100 text-purple-700 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-semibold", // 完全覆盖样式
        label: "硬性 OLED",
      };
    case Qualities.RIGENERATO:
      return {
        variant: "outline",
        // className 已有，保持不变或微调
        className:
          "border-orange-400 text-orange-700 bg-orange-50 dark:border-orange-600 dark:text-orange-300 dark:bg-orange-900/30 font-semibold",
        label: "翻新",
      };
    case Qualities.INCELL:
      return {
        variant: "outline",
        // className 已有，保持不变或微调
        className:
          "border-gray-400 text-gray-600 bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:bg-gray-800/50 font-semibold",
        label: "LCD屏",
      };
    case Qualities.COMPATIBILE:
      return {
        variant: "outline", // 保持 outline
        className: "text-muted-foreground font-medium", // 调整样式，使其不那么突出
        label: "组装",
      };
    default: // 未知或 null/undefined
      return {
        variant: "outline", // 基础 variant
        className: "text-muted-foreground italic", // 斜体表示未知
        label: quality || "未知",
      };
  }
};
