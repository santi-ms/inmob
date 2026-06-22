import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyForm } from "@/components/properties/property-form";

export const metadata: Metadata = {
  title: "Editar propiedad | INMOB",
};

async function getProperty(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/properties/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

async function getZones() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/zones`, { cache: "no-store" });
  if (!res.ok) return { data: [] };
  return res.json();
}

export default async function EditarPropiedad({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [property, { data: zones }] = await Promise.all([
    getProperty(id),
    getZones(),
  ]);

  if (!property) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Editar propiedad</h1>
        <p className="text-sm text-muted-foreground">
          Modificá los datos de tu propiedad
        </p>
      </div>
      <PropertyForm zones={zones} initialData={property} propertyId={id} />
    </div>
  );
}
