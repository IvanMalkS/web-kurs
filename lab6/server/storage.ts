import { users, gadgets, news, releases, type User, type InsertUser, type Gadget, type InsertGadget, type NewsPost, type InsertNews, type Release, type InsertRelease } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getGadgets(category?: string, featured?: boolean): Promise<Gadget[]>;
  getGadget(id: number): Promise<Gadget | undefined>;
  createGadget(gadget: InsertGadget): Promise<Gadget>;
  updateGadget(id: number, gadget: Partial<InsertGadget>): Promise<Gadget | undefined>;
  deleteGadget(id: number): Promise<void>;

  getNews(): Promise<NewsPost[]>;
  createNews(news: InsertNews): Promise<NewsPost>;
  deleteNews(id: number): Promise<void>;
  getReleases(): Promise<Release[]>;
  createRelease(release: InsertRelease): Promise<Release>;
  deleteRelease(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getGadgets(category?: string, featured?: boolean): Promise<Gadget[]> {
    let query = db.select().from(gadgets).orderBy(desc(gadgets.createdAt));
    
    if (category) {
      // @ts-ignore - dynamic where
      query = query.where(eq(gadgets.category, category));
    }
    
    const results = await query;
    let filtered = results;
    
    if (category) {
       filtered = filtered.filter(g => g.category === category);
    }
    if (featured !== undefined) {
      filtered = filtered.filter(g => g.isFeatured === featured);
    }
    
    return filtered;
  }

  async getGadget(id: number): Promise<Gadget | undefined> {
    const [gadget] = await db.select().from(gadgets).where(eq(gadgets.id, id));
    return gadget;
  }

  async createGadget(insertGadget: InsertGadget): Promise<Gadget> {
    const [gadget] = await db.insert(gadgets).values(insertGadget).returning();
    return gadget;
  }

  async updateGadget(id: number, updates: Partial<InsertGadget>): Promise<Gadget | undefined> {
    const [updated] = await db.update(gadgets).set(updates).where(eq(gadgets.id, id)).returning();
    return updated;
  }

  async deleteGadget(id: number): Promise<void> {
    await db.delete(gadgets).where(eq(gadgets.id, id));
  }

  async getNews(): Promise<NewsPost[]> {
    return await db.select().from(news).orderBy(desc(news.publishedAt));
  }

  async createNews(insertNews: InsertNews): Promise<NewsPost> {
    const [item] = await db.insert(news).values(insertNews).returning();
    return item;
  }

  async deleteNews(id: number): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  async getReleases(): Promise<Release[]> {
    return await db.select().from(releases).orderBy(releases.releaseDate);
  }

  async createRelease(insertRelease: InsertRelease): Promise<Release> {
    const [item] = await db.insert(releases).values(insertRelease).returning();
    return item;
  }

  async deleteRelease(id: number): Promise<void> {
    await db.delete(releases).where(eq(releases.id, id));
  }
}

export const storage = new DatabaseStorage();
