import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "INR" | "USD" | "GBP" | "BDT" | "EUR";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  const { currency = "INR", notation = "standard" } = options;

  const currencyPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("us-en", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(currencyPrice);
}
