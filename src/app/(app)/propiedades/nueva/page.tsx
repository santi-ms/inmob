import type { Metadata } from "next";
import { PropertyForm } from "@/components/properties/property-form";

export const metadata: Metadata = {
  title: "Publicar propiedad | INMOB",
  description: "Publicá tu propiedad en Posadas",
};

async function getZones() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/zones`, { cache: "no-store" });
  if (!res.ok) return { data: [] };
  return res.json();
}

export default async function NuevaPropiedad() {
  const { data: zones } = await getZones();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Publicar propiedad</h1>
        <p className="text-sm text-muted-foreground">
          Completá los datos de tu propiedad para publicarla
        </p>
      </div>
      <PropertyForm zones={zones} />
    </div>
  );
}
