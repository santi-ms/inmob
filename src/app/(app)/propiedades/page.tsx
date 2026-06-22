import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyFilters } from "@/components/properties/property-filters";
import { PropertyGrid } from "@/components/properties/property-grid";

export const metadata: Metadata = {
  title: "Propiedades | INMOB",
  description: "Buscá propiedades en Posadas, Misiones",
};

async function getProperties(searchParams: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, val]) => {
    if (val) params.set(key, val);
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/properties?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) return { data: [], pagination: { page: 1, totalPages: 1, total: 0, limit: 12 } };
  return res.json();
}

async function getZones() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/zones`, { cache: "no-store" });
  if (!res.ok) return { data: [] };
  return res.json();
}

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const [propertiesRes, zonesRes] = await Promise.all([
    getProperties(params),
    getZones(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Propiedades</h1>
          <p className="text-sm text-muted-foreground">
            Encontrá tu propiedad ideal en Posadas
          </p>
        </div>
        <Button render={<Link href="/propiedades/nueva" />} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Publicar</span>
        </Button>
      </div>

      {/* Filters */}
      <Suspense fallback={<Skeleton className="h-12 w-full" />}>
        <PropertyFilters zones={zonesRes.data} total={propertiesRes.pagination.total} />
      </Suspense>

      {/* Grid */}
      <div className="mt-8">
        <PropertyGrid
          properties={propertiesRes.data}
          pagination={propertiesRes.pagination}
        />
      </div>
    </div>
  );
}
