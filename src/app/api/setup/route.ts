import { NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";

// One-time setup route — delete after running
const SETUP_SECRET = process.env.SETUP_SECRET || "inmob-setup-2024";

export async function POST(request: NextRequest) {
  const { secret } = await request.json();

  if (secret !== SETUP_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);
  const results: string[] = [];

  try {
    // Create enums
    const enums = [
      `CREATE TYPE IF NOT EXISTS "public"."payment_status" AS ENUM('pending', 'approved', 'rejected', 'refunded')`,
      `CREATE TYPE IF NOT EXISTS "public"."price_rating" AS ENUM('below_market', 'at_market', 'above_market')`,
      `CREATE TYPE IF NOT EXISTS "public"."property_operation" AS ENUM('sale', 'rent')`,
      `CREATE TYPE IF NOT EXISTS "public"."property_source" AS ENUM('manual', 'zonaprop', 'argenprop', 'mercadolibre')`,
      `CREATE TYPE IF NOT EXISTS "public"."property_status" AS ENUM('active', 'inactive', 'pending', 'sold', 'rented')`,
      `CREATE TYPE IF NOT EXISTS "public"."property_type" AS ENUM('house', 'apartment', 'land', 'commercial', 'office', 'warehouse')`,
      `CREATE TYPE IF NOT EXISTS "public"."subscription_status" AS ENUM('active', 'cancelled', 'expired', 'past_due')`,
      `CREATE TYPE IF NOT EXISTS "public"."user_role" AS ENUM('user', 'owner', 'admin')`,
    ];

    for (const stmt of enums) {
      try {
        await sql.query(stmt);
        results.push(`OK: ${stmt.slice(0, 60)}...`);
      } catch (e: any) {
        if (e.message?.includes("already exists")) {
          results.push(`SKIP: ${stmt.slice(0, 60)}... (already exists)`);
        } else {
          throw e;
        }
      }
    }

    // Create tables
    const tables = [
      `CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "email" varchar(255) NOT NULL,
        "name" varchar(255),
        "image" text,
        "password_hash" text,
        "role" "user_role" DEFAULT 'user' NOT NULL,
        "phone" varchar(30),
        "ai_queries_used" integer DEFAULT 0 NOT NULL,
        "ai_queries_reset_at" timestamp,
        "email_verified" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "users_email_unique" UNIQUE("email")
      )`,
      `CREATE TABLE IF NOT EXISTS "accounts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
        "type" varchar(255) NOT NULL,
        "provider" varchar(255) NOT NULL,
        "provider_account_id" varchar(255) NOT NULL,
        "refresh_token" text,
        "access_token" text,
        "expires_at" integer,
        "token_type" varchar(255),
        "scope" varchar(255),
        "id_token" text,
        "session_state" text
      )`,
      `CREATE TABLE IF NOT EXISTS "sessions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "session_token" varchar(255) NOT NULL UNIQUE,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
        "expires" timestamp NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS "verification_tokens" (
        "identifier" varchar(255) NOT NULL,
        "token" varchar(255) NOT NULL UNIQUE,
        "expires" timestamp NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS "zones" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar(255) NOT NULL UNIQUE,
        "slug" varchar(255) NOT NULL UNIQUE,
        "polygon" jsonb,
        "avg_price_per_m2_sale" numeric(12, 2),
        "avg_price_per_m2_rent" numeric(12, 2),
        "properties_count" integer DEFAULT 0 NOT NULL,
        "last_calculated_at" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS "subscriptions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
        "plan" varchar(50) NOT NULL,
        "status" "subscription_status" DEFAULT 'active' NOT NULL,
        "mp_subscription_id" varchar(255),
        "current_period_start" timestamp NOT NULL,
        "current_period_end" timestamp NOT NULL,
        "cancelled_at" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS "properties" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid REFERENCES "users"("id") ON DELETE set null,
        "zone_id" integer REFERENCES "zones"("id"),
        "title" varchar(500) NOT NULL,
        "description" text,
        "type" "property_type" NOT NULL,
        "operation" "property_operation" NOT NULL,
        "status" "property_status" DEFAULT 'active' NOT NULL,
        "source" "property_source" DEFAULT 'manual' NOT NULL,
        "source_url" text,
        "source_id" varchar(255),
        "price_ars" numeric(15, 2),
        "price_usd" numeric(15, 2),
        "currency" varchar(3) DEFAULT 'USD' NOT NULL,
        "expenses" numeric(12, 2),
        "address" varchar(500),
        "city" varchar(100) DEFAULT 'Posadas',
        "latitude" numeric(10, 7),
        "longitude" numeric(10, 7),
        "total_area_m2" numeric(10, 2),
        "covered_area_m2" numeric(10, 2),
        "bedrooms" integer,
        "bathrooms" integer,
        "garages" integer,
        "floors" integer,
        "year_built" integer,
        "amenities" jsonb,
        "price_per_m2" numeric(12, 2),
        "price_rating" "price_rating",
        "views_count" integer DEFAULT 0 NOT NULL,
        "featured" boolean DEFAULT false NOT NULL,
        "scraped_at" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS "property_images" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "property_id" uuid NOT NULL REFERENCES "properties"("id") ON DELETE cascade,
        "url" text NOT NULL,
        "r2_key" varchar(500),
        "order" integer DEFAULT 0 NOT NULL,
        "is_primary" boolean DEFAULT false NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS "consultations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
        "messages" jsonb NOT NULL,
        "tokens_used" integer DEFAULT 0,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS "payments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
        "subscription_id" uuid REFERENCES "subscriptions"("id"),
        "mp_payment_id" varchar(255),
        "mp_preference_id" varchar(255),
        "amount" numeric(12, 2) NOT NULL,
        "currency" varchar(3) DEFAULT 'ARS' NOT NULL,
        "status" "payment_status" DEFAULT 'pending' NOT NULL,
        "description" varchar(500),
        "created_at" timestamp DEFAULT now() NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS "price_index" (
        "id" serial PRIMARY KEY NOT NULL,
        "zone_id" integer NOT NULL REFERENCES "zones"("id"),
        "operation" "property_operation" NOT NULL,
        "property_type" "property_type",
        "avg_price_per_m2" numeric(12, 2) NOT NULL,
        "median_price_per_m2" numeric(12, 2),
        "min_price_per_m2" numeric(12, 2),
        "max_price_per_m2" numeric(12, 2),
        "sample_size" integer NOT NULL,
        "calculated_at" timestamp DEFAULT now() NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS "scraping_logs" (
        "id" serial PRIMARY KEY NOT NULL,
        "source" "property_source" NOT NULL,
        "properties_found" integer DEFAULT 0,
        "properties_new" integer DEFAULT 0,
        "properties_updated" integer DEFAULT 0,
        "errors" jsonb,
        "duration_ms" integer,
        "started_at" timestamp DEFAULT now() NOT NULL,
        "completed_at" timestamp
      )`,
    ];

    for (const stmt of tables) {
      await sql.query(stmt);
      const name = stmt.match(/CREATE TABLE IF NOT EXISTS "(\w+)"/)?.[1];
      results.push(`OK: Table ${name}`);
    }

    // Create indexes
    const indexes = [
      `CREATE UNIQUE INDEX IF NOT EXISTS "accounts_provider_account_idx" ON "accounts" ("provider","provider_account_id")`,
      `CREATE INDEX IF NOT EXISTS "consultations_user_idx" ON "consultations" ("user_id")`,
      `CREATE INDEX IF NOT EXISTS "payments_user_idx" ON "payments" ("user_id")`,
      `CREATE INDEX IF NOT EXISTS "price_index_zone_op_idx" ON "price_index" ("zone_id","operation")`,
      `CREATE INDEX IF NOT EXISTS "properties_zone_idx" ON "properties" ("zone_id")`,
      `CREATE INDEX IF NOT EXISTS "properties_type_op_idx" ON "properties" ("type","operation")`,
      `CREATE INDEX IF NOT EXISTS "properties_status_idx" ON "properties" ("status")`,
      `CREATE INDEX IF NOT EXISTS "properties_source_idx" ON "properties" ("source")`,
      `CREATE INDEX IF NOT EXISTS "properties_location_idx" ON "properties" ("latitude","longitude")`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "properties_source_id_idx" ON "properties" ("source","source_id")`,
      `CREATE INDEX IF NOT EXISTS "property_images_property_idx" ON "property_images" ("property_id")`,
      `CREATE INDEX IF NOT EXISTS "subscriptions_user_idx" ON "subscriptions" ("user_id")`,
      `CREATE INDEX IF NOT EXISTS "subscriptions_status_idx" ON "subscriptions" ("status")`,
      `CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email")`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "verification_tokens_idx" ON "verification_tokens" ("identifier","token")`,
    ];

    for (const stmt of indexes) {
      await sql.query(stmt);
    }
    results.push(`OK: ${indexes.length} indexes created`);

    // Seed zones
    const zones = [
      { name: "Centro", slug: "centro" },
      { name: "Villa Sarita", slug: "villa-sarita" },
      { name: "Miguel Lanús", slug: "miguel-lanus" },
      { name: "Itaembé Miní", slug: "itaembe-mini" },
      { name: "Itaembé Guazú", slug: "itaembe-guazu" },
      { name: "Villa Cabello", slug: "villa-cabello" },
      { name: "A-4", slug: "a-4" },
      { name: "Villa Blosset", slug: "villa-blosset" },
      { name: "Villa Urquiza", slug: "villa-urquiza" },
      { name: "Bajada Vieja", slug: "bajada-vieja" },
      { name: "El Palomar", slug: "el-palomar" },
      { name: "Nemesio Parma", slug: "nemesio-parma" },
      { name: "San Isidro", slug: "san-isidro" },
      { name: "Yohasá", slug: "yohasa" },
      { name: "Cocomarola", slug: "cocomarola" },
      { name: "Palma Sola", slug: "palma-sola" },
      { name: "San Jorge", slug: "san-jorge" },
      { name: "Los Aguacates", slug: "los-aguacates" },
      { name: "Villa Poujade", slug: "villa-poujade" },
      { name: "Lomas del Paraná", slug: "lomas-del-parana" },
    ];

    for (const zone of zones) {
      await sql`INSERT INTO zones (name, slug) VALUES (${zone.name}, ${zone.slug}) ON CONFLICT (slug) DO NOTHING`;
    }
    results.push(`OK: ${zones.length} zones seeded`);

    return Response.json({
      success: true,
      results,
      message: "Database setup complete! You can now delete the /api/setup route.",
    });
  } catch (err) {
    return Response.json(
      {
        error: err instanceof Error ? err.message : "Unknown error",
        results,
      },
      { status: 500 }
    );
  }
}
