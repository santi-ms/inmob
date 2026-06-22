import {
  pgTable,
  pgEnum,
  text,
  varchar,
  integer,
  serial,
  boolean,
  timestamp,
  decimal,
  jsonb,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Enums ──────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["user", "owner", "admin"]);

export const propertyTypeEnum = pgEnum("property_type", [
  "house",
  "apartment",
  "land",
  "commercial",
  "office",
  "warehouse",
]);

export const propertyOperationEnum = pgEnum("property_operation", [
  "sale",
  "rent",
]);

export const propertyStatusEnum = pgEnum("property_status", [
  "active",
  "inactive",
  "pending",
  "sold",
  "rented",
]);

export const propertySourceEnum = pgEnum("property_source", [
  "manual",
  "zonaprop",
  "argenprop",
  "mercadolibre",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "cancelled",
  "expired",
  "past_due",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "approved",
  "rejected",
  "refunded",
]);

export const priceRatingEnum = pgEnum("price_rating", [
  "below_market",
  "at_market",
  "above_market",
]);

// ── Users ──────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }),
    image: text("image"),
    passwordHash: text("password_hash"),
    role: userRoleEnum("role").default("user").notNull(),
    phone: varchar("phone", { length: 30 }),
    aiQueriesUsed: integer("ai_queries_used").default(0).notNull(),
    aiQueriesResetAt: timestamp("ai_queries_reset_at"),
    emailVerified: timestamp("email_verified"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("users_email_idx").on(t.email)]
);

// ── NextAuth Tables ────────────────────────────────────

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [
    uniqueIndex("accounts_provider_account_idx").on(
      t.provider,
      t.providerAccountId
    ),
  ]
);

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expires: timestamp("expires").notNull(),
  },
  (t) => [
    uniqueIndex("verification_tokens_idx").on(t.identifier, t.token),
  ]
);

// ── Zones ──────────────────────────────────────────────

export const zones = pgTable("zones", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  polygon: jsonb("polygon"),
  avgPricePerM2Sale: decimal("avg_price_per_m2_sale", {
    precision: 12,
    scale: 2,
  }),
  avgPricePerM2Rent: decimal("avg_price_per_m2_rent", {
    precision: 12,
    scale: 2,
  }),
  propertiesCount: integer("properties_count").default(0).notNull(),
  lastCalculatedAt: timestamp("last_calculated_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Properties ─────────────────────────────────────────

export const properties = pgTable(
  "properties",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    zoneId: integer("zone_id").references(() => zones.id),

    title: varchar("title", { length: 500 }).notNull(),
    description: text("description"),
    type: propertyTypeEnum("type").notNull(),
    operation: propertyOperationEnum("operation").notNull(),
    status: propertyStatusEnum("status").default("active").notNull(),
    source: propertySourceEnum("source").default("manual").notNull(),
    sourceUrl: text("source_url"),
    sourceId: varchar("source_id", { length: 255 }),

    priceArs: decimal("price_ars", { precision: 15, scale: 2 }),
    priceUsd: decimal("price_usd", { precision: 15, scale: 2 }),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    expenses: decimal("expenses", { precision: 12, scale: 2 }),

    address: varchar("address", { length: 500 }),
    city: varchar("city", { length: 100 }).default("Posadas"),
    latitude: decimal("latitude", { precision: 10, scale: 7 }),
    longitude: decimal("longitude", { precision: 10, scale: 7 }),

    totalAreaM2: decimal("total_area_m2", { precision: 10, scale: 2 }),
    coveredAreaM2: decimal("covered_area_m2", { precision: 10, scale: 2 }),
    bedrooms: integer("bedrooms"),
    bathrooms: integer("bathrooms"),
    garages: integer("garages"),
    floors: integer("floors"),
    yearBuilt: integer("year_built"),
    amenities: jsonb("amenities").$type<string[]>(),

    pricePerM2: decimal("price_per_m2", { precision: 12, scale: 2 }),
    priceRating: priceRatingEnum("price_rating"),

    viewsCount: integer("views_count").default(0).notNull(),
    featured: boolean("featured").default(false).notNull(),

    scrapedAt: timestamp("scraped_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("properties_zone_idx").on(t.zoneId),
    index("properties_type_op_idx").on(t.type, t.operation),
    index("properties_status_idx").on(t.status),
    index("properties_source_idx").on(t.source),
    index("properties_location_idx").on(t.latitude, t.longitude),
    uniqueIndex("properties_source_id_idx").on(t.source, t.sourceId),
  ]
);

// ── Property Images ────────────────────────────────────

export const propertyImages = pgTable(
  "property_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    r2Key: varchar("r2_key", { length: 500 }),
    order: integer("order").default(0).notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("property_images_property_idx").on(t.propertyId)]
);

// ── Price Index ────────────────────────────────────────

export const priceIndex = pgTable(
  "price_index",
  {
    id: serial("id").primaryKey(),
    zoneId: integer("zone_id")
      .notNull()
      .references(() => zones.id),
    operation: propertyOperationEnum("operation").notNull(),
    propertyType: propertyTypeEnum("property_type"),
    avgPricePerM2: decimal("avg_price_per_m2", {
      precision: 12,
      scale: 2,
    }).notNull(),
    medianPricePerM2: decimal("median_price_per_m2", {
      precision: 12,
      scale: 2,
    }),
    minPricePerM2: decimal("min_price_per_m2", { precision: 12, scale: 2 }),
    maxPricePerM2: decimal("max_price_per_m2", { precision: 12, scale: 2 }),
    sampleSize: integer("sample_size").notNull(),
    calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
  },
  (t) => [index("price_index_zone_op_idx").on(t.zoneId, t.operation)]
);

// ── Consultations (AI Chat) ───────────────────────────

export const consultations = pgTable(
  "consultations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    messages: jsonb("messages")
      .$type<
        Array<{ role: "user" | "assistant"; content: string; timestamp: string }>
      >()
      .notNull(),
    tokensUsed: integer("tokens_used").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("consultations_user_idx").on(t.userId)]
);

// ── Subscriptions ──────────────────────────────────────

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    plan: varchar("plan", { length: 50 }).notNull(),
    status: subscriptionStatusEnum("status").default("active").notNull(),
    mpSubscriptionId: varchar("mp_subscription_id", { length: 255 }),
    currentPeriodStart: timestamp("current_period_start").notNull(),
    currentPeriodEnd: timestamp("current_period_end").notNull(),
    cancelledAt: timestamp("cancelled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("subscriptions_user_idx").on(t.userId),
    index("subscriptions_status_idx").on(t.status),
  ]
);

// ── Payments ───────────────────────────────────────────

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id").references(() => subscriptions.id),
    mpPaymentId: varchar("mp_payment_id", { length: 255 }),
    mpPreferenceId: varchar("mp_preference_id", { length: 255 }),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("ARS").notNull(),
    status: paymentStatusEnum("status").default("pending").notNull(),
    description: varchar("description", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("payments_user_idx").on(t.userId)]
);

// ── Scraping Logs ──────────────────────────────────────

export const scrapingLogs = pgTable("scraping_logs", {
  id: serial("id").primaryKey(),
  source: propertySourceEnum("source").notNull(),
  propertiesFound: integer("properties_found").default(0),
  propertiesNew: integer("properties_new").default(0),
  propertiesUpdated: integer("properties_updated").default(0),
  errors: jsonb("errors"),
  durationMs: integer("duration_ms"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// ── Relations ──────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  consultations: many(consultations),
  subscriptions: many(subscriptions),
  payments: many(payments),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  user: one(users, { fields: [properties.userId], references: [users.id] }),
  zone: one(zones, { fields: [properties.zoneId], references: [zones.id] }),
  images: many(propertyImages),
}));

export const propertyImagesRelations = relations(propertyImages, ({ one }) => ({
  property: one(properties, {
    fields: [propertyImages.propertyId],
    references: [properties.id],
  }),
}));

export const zonesRelations = relations(zones, ({ many }) => ({
  properties: many(properties),
  priceIndices: many(priceIndex),
}));

export const priceIndexRelations = relations(priceIndex, ({ one }) => ({
  zone: one(zones, { fields: [priceIndex.zoneId], references: [zones.id] }),
}));

export const consultationsRelations = relations(consultations, ({ one }) => ({
  user: one(users, {
    fields: [consultations.userId],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
  subscription: one(subscriptions, {
    fields: [payments.subscriptionId],
    references: [subscriptions.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
