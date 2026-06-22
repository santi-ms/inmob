import type { properties, propertyImages, zones } from "./db/schema";

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type PropertyImage = typeof propertyImages.$inferSelect;
export type Zone = typeof zones.$inferSelect;

export type PropertyWithImages = Property & {
  images: PropertyImage[];
  zone: Zone | null;
};

export type PropertyFilters = {
  type?: string;
  operation?: string;
  zone?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  currency?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type PropertyFormData = {
  title: string;
  description?: string;
  type: string;
  operation: string;
  zoneId?: number;
  priceUsd?: number;
  priceArs?: number;
  currency: string;
  expenses?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  totalAreaM2?: number;
  coveredAreaM2?: number;
  bedrooms?: number;
  bathrooms?: number;
  garages?: number;
  floors?: number;
  yearBuilt?: number;
  amenities?: string[];
};
