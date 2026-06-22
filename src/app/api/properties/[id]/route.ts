import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { properties, propertyImages, zones } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { calculatePricePerM2 } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const result = await db
    .select()
    .from(properties)
    .leftJoin(zones, eq(properties.zoneId, zones.id))
    .where(eq(properties.id, id))
    .limit(1);

  if (result.length === 0) {
    return Response.json({ error: "Propiedad no encontrada" }, { status: 404 });
  }

  const images = await db
    .select()
    .from(propertyImages)
    .where(eq(propertyImages.propertyId, id))
    .orderBy(propertyImages.order);

  await db
    .update(properties)
    .set({ viewsCount: sql`${properties.viewsCount} + 1` })
    .where(eq(properties.id, id));

  return Response.json({
    data: {
      ...result[0].properties,
      zone: result[0].zones,
      images,
    },
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const existing = await db
    .select()
    .from(properties)
    .where(eq(properties.id, id))
    .limit(1);

  if (existing.length === 0) {
    return Response.json({ error: "Propiedad no encontrada" }, { status: 404 });
  }

  const price = body.currency === "USD" ? body.priceUsd : body.priceArs;
  const pricePerM2 = calculatePricePerM2(price, body.totalAreaM2);

  const [updated] = await db
    .update(properties)
    .set({
      title: body.title,
      description: body.description,
      type: body.type,
      operation: body.operation,
      zoneId: body.zoneId || null,
      priceUsd: body.priceUsd?.toString(),
      priceArs: body.priceArs?.toString(),
      currency: body.currency || "USD",
      expenses: body.expenses?.toString(),
      address: body.address,
      latitude: body.latitude?.toString(),
      longitude: body.longitude?.toString(),
      totalAreaM2: body.totalAreaM2?.toString(),
      coveredAreaM2: body.coveredAreaM2?.toString(),
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      garages: body.garages,
      floors: body.floors,
      yearBuilt: body.yearBuilt,
      amenities: body.amenities,
      pricePerM2: pricePerM2?.toString(),
      updatedAt: new Date(),
    })
    .where(eq(properties.id, id))
    .returning();

  return Response.json({ data: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await db
    .select()
    .from(properties)
    .where(eq(properties.id, id))
    .limit(1);

  if (existing.length === 0) {
    return Response.json({ error: "Propiedad no encontrada" }, { status: 404 });
  }

  await db.delete(properties).where(eq(properties.id, id));

  return Response.json({ success: true });
}
