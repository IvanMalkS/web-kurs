import { z } from 'zod';
import { insertGadgetSchema, insertNewsSchema, insertReleaseSchema, insertUserSchema, gadgets, news, releases } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  })
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.object({ id: z.number(), username: z.string() }),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof gadgets.$inferSelect>().optional().nullable(), // Returns User or null
      },
    }
  },
  gadgets: {
    list: {
      method: 'GET' as const,
      path: '/api/gadgets',
      input: z.object({
        category: z.string().optional(),
        featured: z.boolean().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof gadgets.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/gadgets/:id',
      responses: {
        200: z.custom<typeof gadgets.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/gadgets',
      input: insertGadgetSchema,
      responses: {
        201: z.custom<typeof gadgets.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/gadgets/:id',
      input: insertGadgetSchema.partial(),
      responses: {
        200: z.custom<typeof gadgets.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/gadgets/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  news: {
    list: {
      method: 'GET' as const,
      path: '/api/news',
      responses: {
        200: z.array(z.custom<typeof news.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/news',
      input: insertNewsSchema,
      responses: {
        201: z.custom<typeof news.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/news/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  releases: {
    list: {
      method: 'GET' as const,
      path: '/api/releases',
      responses: {
        200: z.array(z.custom<typeof releases.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/releases',
      input: insertReleaseSchema,
      responses: {
        201: z.custom<typeof releases.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/releases/:id',
      responses: {
        204: z.void(),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
