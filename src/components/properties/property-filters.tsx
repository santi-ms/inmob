"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PROPERTY_TYPES, PROPERTY_OPERATIONS } from "@/lib/constants";

interface Zone {
  id: number;
  name: string;
  slug: string;
}

interface PropertyFiltersProps {
  zones: Zone[];
  total: number;
}

export function PropertyFilters({ zones, total }: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const activeFilters = ["type", "operation", "zone", "bedrooms", "minPrice", "maxPrice"]
    .filter((key) => searchParams.has(key)).length;

  const updateParams = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/propiedades?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push("/propiedades");
    setSearch("");
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateParams("search", search || null);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, updateParams]);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar propiedades..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Mobile filters */}
        <Sheet>
          <SheetTrigger
            render={<Button variant="outline" size="icon" className="shrink-0 sm:hidden" />}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <FilterSelects
                searchParams={searchParams}
                zones={zones}
                updateParams={updateParams}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop filters */}
      <div className="hidden flex-wrap items-center gap-2 sm:flex">
        <FilterSelects
          searchParams={searchParams}
          zones={zones}
          updateParams={updateParams}
          inline
        />

        <div className="ml-auto flex items-center gap-2">
          {activeFilters > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
              <X className="h-3.5 w-3.5" />
              Limpiar
            </Button>
          )}
          <Badge variant="secondary">
            {total} {total === 1 ? "propiedad" : "propiedades"}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function FilterSelects({
  searchParams,
  zones,
  updateParams,
  inline,
}: {
  searchParams: URLSearchParams;
  zones: Zone[];
  updateParams: (key: string, value: string | null) => void;
  inline?: boolean;
}) {
  const className = inline ? "w-[150px]" : "w-full";

  return (
    <>
      <Select
        value={searchParams.get("operation") || "all"}
        onValueChange={(v) => updateParams("operation", v)}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder="Operación" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {Object.entries(PROPERTY_OPERATIONS).map(([val, label]) => (
            <SelectItem key={val} value={val}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("type") || "all"}
        onValueChange={(v) => updateParams("type", v)}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {Object.entries(PROPERTY_TYPES).map(([val, label]) => (
            <SelectItem key={val} value={val}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("zone") || "all"}
        onValueChange={(v) => updateParams("zone", v)}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder="Zona" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las zonas</SelectItem>
          {zones.map((zone) => (
            <SelectItem key={zone.id} value={zone.id.toString()}>
              {zone.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("bedrooms") || "all"}
        onValueChange={(v) => updateParams("bedrooms", v)}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder="Dormitorios" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Cualquiera</SelectItem>
          <SelectItem value="1">1 dormitorio</SelectItem>
          <SelectItem value="2">2 dormitorios</SelectItem>
          <SelectItem value="3">3 dormitorios</SelectItem>
          <SelectItem value="4">4+ dormitorios</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
