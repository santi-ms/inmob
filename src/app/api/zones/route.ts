import { db } from "@/lib/db";
import { zones } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const data = await db.select().from(zones).orderBy(asc(zones.name));
  return Response.json({ data });
}
