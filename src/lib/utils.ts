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
