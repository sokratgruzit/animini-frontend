import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Позволяет динамически смешивать классы Tailwind и избегать конфликтов */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
