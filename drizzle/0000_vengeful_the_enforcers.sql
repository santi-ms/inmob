CREATE TYPE "public"."payment_status" AS ENUM('pending', 'approved', 'rejected', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."price_rating" AS ENUM('below_market', 'at_market', 'above_market');--> statement-breakpoint
CREATE TYPE "public"."property_operation" AS ENUM('sale', 'rent');--> statement-breakpoint
CREATE TYPE "public"."property_source" AS ENUM('manual', 'zonaprop', 'argenprop', 'mercadolibre');--> statement-breakpoint
CREATE TYPE "public"."property_status" AS ENUM('active', 'inactive', 'pending', 'sold', 'rented');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('house', 'apartment', 'land', 'commercial', 'office', 'warehouse');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'cancelled', 'expired', 'past_due');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'owner', 'admin');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
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
);
--> statement-breakpoint
CREATE TABLE "consultations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"messages" jsonb NOT NULL,
	"tokens_used" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"subscription_id" uuid,
	"mp_payment_id" varchar(255),
	"mp_preference_id" varchar(255),
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'ARS' NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"description" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "price_index" (
	"id" serial PRIMARY KEY NOT NULL,
	"zone_id" integer NOT NULL,
	"operation" "property_operation" NOT NULL,
	"property_type" "property_type",
	"avg_price_per_m2" numeric(12, 2) NOT NULL,
	"median_price_per_m2" numeric(12, 2),
	"min_price_per_m2" numeric(12, 2),
	"max_price_per_m2" numeric(12, 2),
	"sample_size" integer NOT NULL,
	"calculated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"zone_id" integer,
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
);
--> statement-breakpoint
CREATE TABLE "property_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"url" text NOT NULL,
	"r2_key" varchar(500),
	"order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scraping_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"source" "property_source" NOT NULL,
	"properties_found" integer DEFAULT 0,
	"properties_new" integer DEFAULT 0,
	"properties_updated" integer DEFAULT 0,
	"errors" jsonb,
	"duration_ms" integer,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_token" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan" varchar(50) NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"mp_subscription_id" varchar(255),
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"cancelled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
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
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "zones" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"polygon" jsonb,
	"avg_price_per_m2_sale" numeric(12, 2),
	"avg_price_per_m2_rent" numeric(12, 2),
	"properties_count" integer DEFAULT 0 NOT NULL,
	"last_calculated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "zones_name_unique" UNIQUE("name"),
	CONSTRAINT "zones_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_index" ADD CONSTRAINT "price_index_zone_id_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_zone_id_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_provider_account_idx" ON "accounts" USING btree ("provider","provider_account_id");--> statement-breakpoint
CREATE INDEX "consultations_user_idx" ON "consultations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payments_user_idx" ON "payments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "price_index_zone_op_idx" ON "price_index" USING btree ("zone_id","operation");--> statement-breakpoint
CREATE INDEX "properties_zone_idx" ON "properties" USING btree ("zone_id");--> statement-breakpoint
CREATE INDEX "properties_type_op_idx" ON "properties" USING btree ("type","operation");--> statement-breakpoint
CREATE INDEX "properties_status_idx" ON "properties" USING btree ("status");--> statement-breakpoint
CREATE INDEX "properties_source_idx" ON "properties" USING btree ("source");--> statement-breakpoint
CREATE INDEX "properties_location_idx" ON "properties" USING btree ("latitude","longitude");--> statement-breakpoint
CREATE UNIQUE INDEX "properties_source_id_idx" ON "properties" USING btree ("source","source_id");--> statement-breakpoint
CREATE INDEX "property_images_property_idx" ON "property_images" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "subscriptions_user_idx" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscriptions_status_idx" ON "subscriptions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "verification_tokens_idx" ON "verification_tokens" USING btree ("identifier","token");