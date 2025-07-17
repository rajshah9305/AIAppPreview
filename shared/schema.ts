import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  prompt: text("prompt").notNull(),
  variations: jsonb("variations").$type<CodeVariation[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  keyHash: text("key_hash").notNull(),
  provider: text("provider").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export interface CodeVariation {
  id: string;
  code: string;
  style: string;
  quality: number;
  size: string;
  lines: number;
}

export interface GenerationProgress {
  variationId: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  progress: number;
  code?: string;
}

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  prompt: true,
  variations: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
