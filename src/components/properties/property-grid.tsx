"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { PropertyCard } from "./property-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PropertyGridProps {
  properties: Array<{
    id: string;
    title: string;
    type: string;
    operation: string;
    priceUsd?: string | null;
    priceArs?: string | null;
    currency: string;
    address?: string | null;
    totalAreaM2?: string | null;
    coveredAreaM2?: string | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    garages?: number | null;
    pricePerM2?: string | null;
    priceRating?: string | null;
    zone?: { name: string; slug: string } | null;
    images?: Array<{ url: string; isPrimary: boolean }>;
  }>;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
  };
}

export function PropertyGrid({ properties, pagination }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 text-center"
      >
        <Building2 className="mb-4 h-12 w-12 text-muted-foreground/30" />
        <p className="text-lg font-medium text-muted-foreground">
          No se encontraron propiedades
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          Probá ajustando los filtros o cargá una nueva
        </p>
        <Button render={<Link href="/propiedades/nueva" />}>
          Publicar propiedad
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property, index) => (
          <PropertyCard key={property.id} property={property} index={index} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <Link
                key={page}
                href={`/propiedades?page=${page}`}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === pagination.page
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {page}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}
