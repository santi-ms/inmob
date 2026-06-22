import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string | null, currency: string = "USD"): string {
  if (!price) return "Consultar";
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (currency === "USD") {
    return `US$ ${num.toLocaleString("es-AR")}`;
  }
  return `$ ${num.toLocaleString("es-AR")}`;
}

export function formatArea(area: number | string | null): string {
  if (!area) return "-";
  const num = typeof area === "string" ? parseFloat(area) : area;
  return `${num.toLocaleString("es-AR")} m²`;
}

export function calculatePricePerM2(
  price: number | string | null,
  area: number | string | null
): number | null {
  if (!price || !area) return null;
  const p = typeof price === "string" ? parseFloat(price) : price;
  const a = typeof area === "string" ? parseFloat(area) : area;
  if (a === 0) return null;
  return Math.round(p / a);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
