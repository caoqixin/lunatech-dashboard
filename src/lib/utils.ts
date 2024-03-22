import { type ClassValue, clsx } from "clsx";
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
