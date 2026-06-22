import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { properties, propertyImages, zones } from "@/lib/db/schema";
import { eq, and, gte, lte, ilike, sql, desc, asc } from "drizzle-orm";
import { calculatePricePerM2 } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const type = searchParams.get("type");
  const operation = searchParams.get("operation");
  const zoneId = searchParams.get("zone");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const bedrooms = searchParams.get("bedrooms");
  const currency = searchParams.get("currency") || "USD";
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);
  const sort = searchParams.get("sort") || "newest";

  const conditions = [eq(properties.status, "active")];

  if (type) conditions.push(eq(properties.type, type as any));
  if (operation) conditions.push(eq(properties.operation, operation as any));
  if (zoneId) conditions.push(eq(properties.zoneId, parseInt(zoneId)));
  if (bedrooms) conditions.push(eq(properties.bedrooms, parseInt(bedrooms)));
  if (search) conditions.push(ilike(properties.title, `%${search}%`));

  const priceCol = currency === "USD" ? properties.priceUsd : properties.priceArs;
  if (minPrice) conditions.push(gte(priceCol, minPrice));
  if (maxPrice) conditions.push(lte(priceCol, maxPrice));

  const orderBy = sort === "price_asc" ? asc(priceCol) :
                  sort === "price_desc" ? desc(priceCol) :
                  desc(properties.createdAt);

  const offset = (page - 1) * limit;

  const [results, countResult] = await Promise.all([
    db
      .select()
      .from(properties)
      .leftJoin(zones, eq(properties.zoneId, zones.id))
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(properties)
      .where(and(...conditions)),
  ]);

  const propertyIds = results.map((r) => r.properties.id);

  const images = propertyIds.length > 0
    ? await db
        .select()
        .from(propertyImages)
        .where(sql`${propertyImages.propertyId} IN ${propertyIds}`)
    : [];

  const data = results.map((r) => ({
    ...r.properties,
    zone: r.zones,
    images: images.filter((img) => img.propertyId === r.properties.id),
  }));

  const total = Number(countResult[0]?.count || 0);

  return Response.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    title,
    description,
    type,
    operation,
    zoneId,
    priceUsd,
    priceArs,
    currency,
    expenses,
    address,
    latitude,
    longitude,
    totalAreaM2,
    coveredAreaM2,
    bedrooms,
    bathrooms,
    garages,
    floors,
    yearBuilt,
    amenities,
    userId,
  } = body;

  if (!title || !type || !operation) {
    return Response.json(
      { error: "Título, tipo y operación son requeridos" },
      { status: 400 }
    );
  }

  const price = currency === "USD" ? priceUsd : priceArs;
  const pricePerM2 = calculatePricePerM2(price, totalAreaM2);

  const [property] = await db
    .insert(properties)
    .values({
      title,
      description,
      type,
      operation,
      zoneId: zoneId || null,
      priceUsd: priceUsd?.toString(),
      priceArs: priceArs?.toString(),
      currency: currency || "USD",
      expenses: expenses?.toString(),
      address,
      latitude: latitude?.toString(),
      longitude: longitude?.toString(),
      totalAreaM2: totalAreaM2?.toString(),
      coveredAreaM2: coveredAreaM2?.toString(),
      bedrooms,
      bathrooms,
      garages,
      floors,
      yearBuilt,
      amenities,
      pricePerM2: pricePerM2?.toString(),
      userId: userId || null,
      source: "manual",
      status: "active",
    })
    .returning();

  return Response.json({ data: property }, { status: 201 });
}
