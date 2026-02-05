import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth } from "./auth";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const { hashPassword } = setupAuth(app);

  const existingAdmin = await storage.getUserByUsername("admin");
  if (!existingAdmin) {
    const hashedPassword = await hashPassword("admin123");
    await storage.createUser({
      username: "admin",
      password: hashedPassword,
      isAdmin: true,
    });
    console.log("Admin user created: admin / admin123");
  }

  const gadgets = await storage.getGadgets();
  if (gadgets.length === 0) {
    await storage.createGadget({
      name: "iPhone 16 Pro",
      category: "Смартфоны",
      summary: "Последний флагман Apple с процессором A18 Bionic.",
      content: "iPhone 16 Pro получил новый дизайн, улучшенные камеры и мощный чип A18. Время автономной работы стало еще больше, а новая титановая отделка выглядит премиально.",
      price: 999,
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=1000",
      isFeatured: true,
    });
    await storage.createGadget({
      name: "Samsung Galaxy S25",
      category: "Смартфоны",
      summary: "Лучший опыт работы с Android.",
      content: "Samsung продолжает совершенствовать свою формулу с S25. Экран стал ярче, S-Pen — быстрее, а функции ИИ действительно полезны.",
      price: 899,
      rating: 4,
      imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=1000",
      isFeatured: true,
    });
    await storage.createGadget({
      name: "MacBook Air M4",
      category: "Ноутбуки",
      summary: "Тонкий, легкий и быстрее, чем когда-либо.",
      content: "Чип M4 делает MacBook Air мощным инструментом для повседневных задач и даже профессиональных рабочих процессов. Он остается бесшумным и холодным под нагрузкой.",
      price: 1199,
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000",
      isFeatured: false,
    });
  }

  const news = await storage.getNews();
  if (news.length === 0) {
    await storage.createNews({
      title: "Технологические гиганты объявили о партнерстве в области ИИ",
      content: "Крупнейшие технологические компании согласовали новый набор стандартов безопасности и разработки ИИ...",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
    });
    await storage.createNews({
      title: "Новая технология аккумуляторов может удвоить время работы телефона",
      content: "Исследователи из MIT обнаружили новый материал, который может революционизировать литий-ионные аккумуляторы...",
      imageUrl: "https://images.unsplash.com/photo-1619641443424-d232537c356f?auto=format&fit=crop&q=80&w=1000",
    });
  }

  const releases = await storage.getReleases();
  if (releases.length === 0) {
    await storage.createRelease({
      productName: "Запуск Pixel 10",
      releaseDate: new Date("2025-10-15").toISOString(),
      description: "Ежегодное мероприятие Google по презентации оборудования.",
    });
    await storage.createRelease({
      productName: "Анонс консоли следующего поколения",
      releaseDate: new Date("2025-11-20").toISOString(),
      description: "Ожидается, что Sony представит тизер PS6.",
    });
  }

  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send("Unauthorized");
  };

  app.get(api.gadgets.list.path, async (req, res) => {
    const category = req.query.category as string | undefined;
    const featured = req.query.featured === 'true';
    const items = await storage.getGadgets(category, featured);
    res.json(items);
  });

  app.get(api.gadgets.get.path, async (req, res) => {
    const item = await storage.getGadget(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Gadget not found" });
    res.json(item);
  });

  app.post(api.gadgets.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.gadgets.create.input.parse(req.body);
      const item = await storage.createGadget(input);
      res.status(201).json(item);
    } catch (e) {
      if (e instanceof z.ZodError) {
        res.status(400).json(e.errors);
      } else {
        res.status(500).send("Internal Server Error");
      }
    }
  });

  app.put(api.gadgets.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.gadgets.update.input.parse(req.body);
      const item = await storage.updateGadget(Number(req.params.id), input);
      if (!item) return res.status(404).json({ message: "Gadget not found" });
      res.json(item);
    } catch (e) {
      if (e instanceof z.ZodError) {
        res.status(400).json(e.errors);
      } else {
        res.status(500).send("Internal Server Error");
      }
    }
  });

  app.delete(api.gadgets.delete.path, requireAuth, async (req, res) => {
    await storage.deleteGadget(Number(req.params.id));
    res.sendStatus(204);
  });

  app.get(api.news.list.path, async (req, res) => {
    const items = await storage.getNews();
    res.json(items);
  });

  app.post(api.news.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.news.create.input.parse(req.body);
      const item = await storage.createNews(input);
      res.status(201).json(item);
    } catch (e) {
      res.status(400).json(e);
    }
  });

  app.delete(api.news.delete.path, requireAuth, async (req, res) => {
    await storage.deleteNews(Number(req.params.id));
    res.sendStatus(204);
  });

  app.get(api.releases.list.path, async (req, res) => {
    const items = await storage.getReleases();
    res.json(items);
  });

  app.post(api.releases.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.releases.create.input.parse(req.body);
      const item = await storage.createRelease(input);
      res.status(201).json(item);
    } catch (e) {
      res.status(400).json(e);
    }
  });

  app.delete(api.releases.delete.path, requireAuth, async (req, res) => {
    await storage.deleteRelease(Number(req.params.id));
    res.sendStatus(204);
  });

  return httpServer;
}
