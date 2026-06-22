import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = "USD"): string {
  if (currency === "USD") {
    return `US$ ${price.toLocaleString("es-AR")}`;
  }
  return `$ ${price.toLocaleString("es-AR")}`;
}

export function formatArea(area: number): string {
  return `${area.toLocaleString("es-AR")} m²`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
