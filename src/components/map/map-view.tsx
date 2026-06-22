"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, List, Loader2, Map as MapIcon, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyCard } from "@/components/properties/property-card";
import { PROPERTY_TYPES, PROPERTY_OPERATIONS } from "@/lib/constants";

const PropertyMap = dynamic(
  () => import("./map-container").then((mod) => mod.PropertyMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-xl" />,
  }
);

interface MapProperty {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  price: string;
  currency: string;
  type: string;
  operation: string;
  priceUsd?: string | null;
  priceArs?: string | null;
  address?: string | null;
  totalAreaM2?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  garages?: number | null;
  pricePerM2?: string | null;
  zone?: { name: string; slug: string } | null;
  images?: Array<{ url: string; isPrimary: boolean }>;
}

export function MapView() {
  const [view, setView] = useState<"map" | "list">("map");
  const [properties, setProperties] = useState<MapProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [type, setType] = useState(searchParams?.get("type") || "");
  const [operation, setOperation] = useState(searchParams?.get("operation") || "");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (operation) params.set("operation", operation);
    params.set("limit", "100");

    try {
      const res = await fetch(`/api/properties?${params.toString()}`);
      const json = await res.json();

      const mapped = json.data
        .filter((p: any) => p.latitude && p.longitude)
        .map((p: any) => ({
          ...p,
          latitude: parseFloat(p.latitude),
          longitude: parseFloat(p.longitude),
          price: p.currency === "USD" ? p.priceUsd : p.priceArs,
        }));

      setProperties(mapped);
      setTotal(json.pagination.total);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [type, operation]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const updateFilter = (key: string, value: string | null) => {
    const v = value || "";
    if (key === "type") setType(v === "all" ? "" : v);
    if (key === "operation") setOperation(v === "all" ? "" : v);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-[calc(100vh-4rem)] flex-col"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-background px-4 py-3">
        <div className="flex items-center gap-2">
          <Select value={type || "all"} onValueChange={(v) => updateFilter("type", v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(PROPERTY_TYPES).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={operation || "all"} onValueChange={(v) => updateFilter("operation", v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Operación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {Object.entries(PROPERTY_OPERATIONS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Badge variant="secondary" className="hidden sm:flex">
            {loading ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : null}
            {total} resultados
          </Badge>
        </div>

        <div className="flex items-center gap-1 rounded-lg border bg-muted p-1">
          <Button
            variant={view === "map" ? "default" : "ghost"}
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setView("map")}
          >
            <MapIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Mapa</span>
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Lista</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === "map" ? (
          <PropertyMap properties={properties} />
        ) : (
          <div className="h-full overflow-y-auto p-4">
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {properties.map((property, idx) => (
                  <PropertyCard key={property.id} property={property} index={idx} />
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Filter className="mx-auto mb-3 h-12 w-12 opacity-30" />
                  <p className="text-lg font-medium">Sin propiedades aún</p>
                  <p className="text-sm">
                    Las propiedades aparecerán aquí cuando se carguen
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
