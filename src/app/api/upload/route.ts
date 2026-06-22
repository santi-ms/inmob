import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { propertyImages } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll("files") as File[];
  const propertyId = formData.get("propertyId") as string;

  if (!files.length || !propertyId) {
    return Response.json(
      { error: "Se requieren archivos y propertyId" },
      { status: 400 }
    );
  }

  const uploaded: Array<{ url: string; key: string }> = [];

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop() || "jpg";
    const key = `properties/${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const r2Endpoint = process.env.R2_ENDPOINT;
    const r2Bucket = process.env.R2_BUCKET_NAME;
    const r2AccessKey = process.env.R2_ACCESS_KEY_ID;

    if (!r2Endpoint || !r2Bucket || !r2AccessKey) {
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;
      uploaded.push({ url: dataUrl, key });
      continue;
    }

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    uploaded.push({ url: publicUrl, key });
  }

  const images = await Promise.all(
    uploaded.map((img, idx) =>
      db
        .insert(propertyImages)
        .values({
          propertyId,
          url: img.url,
          r2Key: img.key,
          order: idx,
          isPrimary: idx === 0,
        })
        .returning()
    )
  );

  return Response.json({ data: images.flat() }, { status: 201 });
}
