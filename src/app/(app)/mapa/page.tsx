import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MapView } from "@/components/map/map-view";

export const metadata: Metadata = {
  title: "Mapa | INMOB",
  description: "Explorá propiedades en el mapa interactivo de Posadas",
};

export default function MapaPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[calc(100vh-4rem)] w-full" />}>
      <MapView />
    </Suspense>
  );
}
