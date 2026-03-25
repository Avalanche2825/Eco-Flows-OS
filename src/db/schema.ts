import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Better Auth Tables (Standard)
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// EcoFlows Specific Tables
export const userProfiles = sqliteTable("user_profiles", {
  userId: text("user_id").primaryKey().references(() => user.id),
  state: text("state").notNull(),
  city: text("city").notNull(),
  language: text("language").notNull(),
  uniqueToken: text("unique_token").notNull(),
  ecoPoints: integer("eco_points").default(0).notNull(),
});

export const ecoPoints = sqliteTable("eco_points", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const communities = sqliteTable("communities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  creatorId: text("creator_id").notNull().references(() => user.id),
  memberCount: integer("member_count").default(1).notNull(),
  ecoPoints: integer("eco_points").default(0).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const communityMembers = sqliteTable("community_members", {
  id: text("id").primaryKey(),
  communityId: text("community_id").notNull().references(() => communities.id),
  userId: text("user_id").notNull().references(() => user.id),
  joinedAt: integer("joined_at", { mode: "timestamp" }).notNull(),
});

export const ecocityCities = sqliteTable("ecocity_cities", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  cityName: text("city_name").notNull(),
  level: integer("level").default(1).notNull(),
  ecoCityScore: real("eco_city_score").default(0).notNull(),
  energyGreenPercent: integer("energy_green_percent").default(0).notNull(),
  waterSustainability: integer("water_sustainability").default(0).notNull(),
  pollutionLevel: integer("pollution_level").default(0).notNull(),
  happinessLevel: integer("happiness_level").default(0).notNull(),
  gridDependence: integer("grid_dependence").default(0).notNull(),
  structures: text("structures"), // JSON string
  population: integer("population").default(0).notNull(),
  money: integer("money").default(100000).notNull(), // Starting ₹1,00,000
  totalRevenue: integer("total_revenue").default(0).notNull(),
  totalExpenses: integer("total_expenses").default(0).notNull(),
  buildQueueSlots: integer("build_queue_slots").default(1).notNull(),
  achievements: text("achievements"), // JSON string
  lastUpdatedAt: integer("last_updated_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const ecocityBuildOrders = sqliteTable("ecocity_build_orders", {
  buildId: text("build_id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  structureType: text("structure_type").notNull(),
  position: text("position"), // JSON string {x, y}
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  startedAt: integer("started_at", { mode: "timestamp" }).notNull(),
  durationSec: integer("duration_sec").notNull(),
  remainingSec: integer("remaining_sec").notNull(),
  expectedFinishAt: integer("expected_finish_at", { mode: "timestamp" }).notNull(),
  status: text("status", { enum: ["building", "finished", "skipped"] }).notNull(),
  freeMicroSkipUsed: integer("free_micro_skip_used", { mode: "boolean" }).default(false).notNull(),
  skipHistory: text("skip_history"), // JSON string
});

export const ecocityPlaytime = sqliteTable("ecocity_playtime", {
  userId: text("user_id").notNull().references(() => user.id),
  date: text("date").notNull(), // YYYY-MM-DD
  playSecondsToday: integer("play_seconds_today").default(0).notNull(),
  lastSessionEnd: integer("last_session_end", { mode: "timestamp" }),
});

export const ecocitySkipLimits = sqliteTable("ecocity_skip_limits", {
  userId: text("user_id").notNull().references(() => user.id),
  date: text("date").notNull(), // YYYY-MM-DD
  freeSkipsUsed: integer("free_skips_used").default(0).notNull(),
  adSkipsUsed: integer("ad_skips_used").default(0).notNull(),
  ecoPointsSpentToday: integer("eco_points_spent_today").default(0).notNull(),
});

export const ecocityAuditLogs = sqliteTable("ecocity_audit_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  buildId: text("build_id").references(() => ecocityBuildOrders.buildId),
  cost: integer("cost").notNull(),
  method: text("method").notNull(), // free, ecoPoints, ad
  skippedSec: integer("skipped_sec").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
});
