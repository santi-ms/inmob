"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Bath, BedDouble, Car, Maximize2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatArea } from "@/lib/utils";
import { PROPERTY_TYPES, PROPERTY_OPERATIONS } from "@/lib/constants";

interface PropertyCardProps {
  property: {
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
  };
  index?: number;
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const price = property.currency === "USD" ? property.priceUsd ?? null : property.priceArs ?? null;
  const primaryImage = property.images?.find((img) => img.isPrimary) || property.images?.[0];
  const typeLabel = PROPERTY_TYPES[property.type as keyof typeof PROPERTY_TYPES];
  const opLabel = PROPERTY_OPERATIONS[property.operation as keyof typeof PROPERTY_OPERATIONS];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/propiedades/${property.id}`}>
        <article className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={property.title}
                fill
                unoptimized={primaryImage.url.startsWith("data:")}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Maximize2 className="h-12 w-12 text-muted-foreground/20" />
              </div>
            )}

            {/* Badges overlay */}
            <div className="absolute left-3 top-3 flex gap-2">
              <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                {opLabel}
              </Badge>
              {property.priceRating === "below_market" && (
                <Badge className="bg-emerald-500/90 text-white backdrop-blur-sm">
                  Buen precio
                </Badge>
              )}
            </div>

            {/* Price overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8">
              <p className="text-lg font-bold text-white">
                {formatPrice(price, property.currency)}
              </p>
              {property.pricePerM2 && (
                <p className="text-xs text-white/80">
                  {formatPrice(property.pricePerM2, property.currency)}/m²
                </p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="line-clamp-1 font-semibold text-foreground">
                {property.title}
              </h3>
              <Badge variant="secondary" className="shrink-0 text-xs">
                {typeLabel}
              </Badge>
            </div>

            {(property.address || property.zone) && (
              <p className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-1">
                  {property.address || property.zone?.name}
                </span>
              </p>
            )}

            {/* Features */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {property.bedrooms != null && (
                <span className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4" />
                  {property.bedrooms}
                </span>
              )}
              {property.bathrooms != null && (
                <span className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  {property.bathrooms}
                </span>
              )}
              {property.garages != null && (
                <span className="flex items-center gap-1">
                  <Car className="h-4 w-4" />
                  {property.garages}
                </span>
              )}
              {property.totalAreaM2 && (
                <span className="flex items-center gap-1">
                  <Maximize2 className="h-4 w-4" />
                  {formatArea(property.totalAreaM2)}
                </span>
              )}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
