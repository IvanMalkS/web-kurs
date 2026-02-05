import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(true),
});

export const gadgets = pgTable("gadgets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  price: integer("price").notNull(),
  rating: integer("rating").default(0),
  imageUrl: text("image_url").notNull(),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  publishedAt: timestamp("published_at").defaultNow(),
});

export const releases = pgTable("releases", {
  id: serial("id").primaryKey(),
  productName: text("product_name").notNull(),
  releaseDate: date("release_date").notNull(),
  description: text("description"),
});

export const insertUserSchema = createInsertSchema(users);
export const insertGadgetSchema = createInsertSchema(gadgets).omit({ id: true, createdAt: true });
export const insertNewsSchema = createInsertSchema(news).omit({ id: true, publishedAt: true });
export const insertReleaseSchema = createInsertSchema(releases).omit({ id: true });

export type User = typeof users.$inferSelect;
export type Gadget = typeof gadgets.$inferSelect;
export type NewsPost = typeof news.$inferSelect;
export type Release = typeof releases.$inferSelect;
