import type { Metadata } from "next";
import { MapView } from "@/components/map/map-view";

export const metadata: Metadata = {
  title: "Mapa",
  description: "Explorá propiedades en el mapa interactivo de Posadas",
};

export default function MapaPage() {
  return <MapView />;
}
