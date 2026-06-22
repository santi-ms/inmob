"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Eye,
  MapPin,
  Maximize2,
  Ruler,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatArea } from "@/lib/utils";
import {
  PROPERTY_TYPES,
  PROPERTY_OPERATIONS,
  PRICE_RATING_CONFIG,
} from "@/lib/constants";

interface PropertyDetailProps {
  property: {
    id: string;
    title: string;
    description?: string | null;
    type: string;
    operation: string;
    status: string;
    priceUsd?: string | null;
    priceArs?: string | null;
    currency: string;
    expenses?: string | null;
    address?: string | null;
    city?: string | null;
    latitude?: string | null;
    longitude?: string | null;
    totalAreaM2?: string | null;
    coveredAreaM2?: string | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    garages?: number | null;
    floors?: number | null;
    yearBuilt?: number | null;
    amenities?: string[] | null;
    pricePerM2?: string | null;
    priceRating?: string | null;
    viewsCount: number;
    createdAt: string;
    zone?: { id: number; name: string; slug: string } | null;
    images?: Array<{ id: string; url: string; isPrimary: boolean; order: number }>;
  };
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = property.images || [];
  const price =
    property.currency === "USD" ? property.priceUsd ?? null : property.priceArs ?? null;
  const typeLabel =
    PROPERTY_TYPES[property.type as keyof typeof PROPERTY_TYPES];
  const opLabel =
    PROPERTY_OPERATIONS[property.operation as keyof typeof PROPERTY_OPERATIONS];
  const ratingConfig = property.priceRating
    ? PRICE_RATING_CONFIG[property.priceRating as keyof typeof PRICE_RATING_CONFIG]
    : null;

  const nextImage = () => setCurrentImage((c) => (c + 1) % images.length);
  const prevImage = () => setCurrentImage((c) => (c - 1 + images.length) % images.length);

  const features = [
    { icon: BedDouble, label: "Dormitorios", value: property.bedrooms },
    { icon: Bath, label: "Baños", value: property.bathrooms },
    { icon: Car, label: "Cocheras", value: property.garages },
    { icon: Maximize2, label: "Sup. Total", value: property.totalAreaM2 ? formatArea(property.totalAreaM2) : null },
    { icon: Ruler, label: "Sup. Cubierta", value: property.coveredAreaM2 ? formatArea(property.coveredAreaM2) : null },
    { icon: Building2, label: "Pisos", value: property.floors },
    { icon: Calendar, label: "Año", value: property.yearBuilt },
  ].filter((f) => f.value != null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8"
    >
      {/* Back + actions */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" render={<Link href="/propiedades" />} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Image gallery */}
          {images.length > 0 && (
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={images[currentImage].url}
                    alt={`${property.title} - Imagen ${currentImage + 1}`}
                    fill
                    unoptimized={images[currentImage].url.startsWith("data:")}
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur-sm transition hover:bg-black/60"
                  >
                    <ChevronLeft className="h-5 w-5 text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur-sm transition hover:bg-black/60"
                  >
                    <ChevronRight className="h-5 w-5 text-white" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-sm">
                    {currentImage + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentImage(idx)}
                  className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg transition ${
                    idx === currentImage
                      ? "ring-2 ring-primary"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    unoptimized={img.url.startsWith("data:")}
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          {property.description && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Descripción</h2>
              <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </section>
          )}

          {/* Features grid */}
          {features.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">Características</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {features.map((feat) => (
                  <div
                    key={feat.label}
                    className="flex items-center gap-3 rounded-xl border p-3"
                  >
                    <feat.icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">{feat.label}</p>
                      <p className="font-semibold">{feat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Amenidades</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="px-3 py-1.5">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="sticky top-24 space-y-4">
            {/* Price card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border bg-card p-6 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2">
                <Badge>{opLabel}</Badge>
                <Badge variant="secondary">{typeLabel}</Badge>
              </div>

              <h1 className="mb-1 text-xl font-bold leading-tight">
                {property.title}
              </h1>

              {(property.address || property.zone) && (
                <p className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {property.address}
                  {property.zone && `, ${property.zone.name}`}
                </p>
              )}

              <Separator className="my-4" />

              <div className="space-y-2">
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(price, property.currency)}
                </p>

                {property.pricePerM2 && (
                  <p className="text-sm text-muted-foreground">
                    <DollarSign className="mr-1 inline h-3.5 w-3.5" />
                    {formatPrice(property.pricePerM2, property.currency)}/m²
                  </p>
                )}

                {property.expenses && (
                  <p className="text-sm text-muted-foreground">
                    Expensas: {formatPrice(property.expenses, "ARS")}
                  </p>
                )}

                {ratingConfig && (
                  <Badge className={`${ratingConfig.bg} ${ratingConfig.color} ${ratingConfig.border} border`}>
                    {ratingConfig.label}
                  </Badge>
                )}
              </div>

              <Separator className="my-4" />

              <Button className="w-full" size="lg">
                Contactar
              </Button>
            </motion.div>

            {/* Stats */}
            <div className="rounded-2xl border bg-card p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {property.viewsCount} visitas
                </span>
                <span>
                  Publicado {new Date(property.createdAt).toLocaleDateString("es-AR")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
