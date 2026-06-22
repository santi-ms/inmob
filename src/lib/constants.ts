export const APP_NAME = "INMOB";
export const APP_DESCRIPTION =
  "Encontrá tu propiedad ideal en Posadas con inteligencia artificial";

export const POSADAS_CENTER = {
  lat: -27.3671,
  lng: -55.8961,
  zoom: 13,
} as const;

export const FREE_LIMITS = {
  maxProperties: 1,
  maxAiQueries: 3,
} as const;

export const PLANS = {
  owner_basic: {
    name: "Básico",
    maxProperties: 10,
    priceArs: 5000,
    features: [
      "Hasta 10 propiedades",
      "Estadísticas básicas",
      "Soporte por email",
    ],
  },
  owner_pro: {
    name: "Profesional",
    maxProperties: Infinity,
    priceArs: 12000,
    features: [
      "Propiedades ilimitadas",
      "Propiedades destacadas",
      "Estadísticas avanzadas",
      "Soporte prioritario",
    ],
  },
  seeker_pro: {
    name: "Buscador Pro",
    maxAiQueries: Infinity,
    priceArs: 3000,
    features: [
      "Consultas IA ilimitadas",
      "Historial completo",
      "Alertas de precios",
      "Recomendaciones personalizadas",
    ],
  },
} as const;

export const PROPERTY_TYPES = {
  house: "Casa",
  apartment: "Departamento",
  land: "Terreno",
  commercial: "Local comercial",
  office: "Oficina",
  warehouse: "Galpón",
} as const;

export const PROPERTY_OPERATIONS = {
  sale: "Venta",
  rent: "Alquiler",
} as const;

export const PRICE_RATING_CONFIG = {
  below_market: {
    label: "Buen precio",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  at_market: {
    label: "Precio promedio",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  above_market: {
    label: "Precio alto",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
} as const;
