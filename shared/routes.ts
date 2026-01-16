import { z } from 'zod';
import { insertUserSchema, insertAssessmentSchema, insertProgressSchema, users, tracks, dailyTasks } from './schema';

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
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  tracks: {
    getCurrent: {
      method: 'GET' as const,
      path: '/api/tracks/current',
      responses: {
        200: z.any(), // Returns TrackWithDetails
        404: errorSchemas.notFound,
      },
    },
    getAll: {
      method: 'GET' as const,
      path: '/api/tracks',
      responses: {
        200: z.array(z.custom<typeof tracks.$inferSelect>()),
      },
    },
  },
  progress: {
    getToday: {
      method: 'GET' as const,
      path: '/api/progress/today',
      responses: {
        200: z.array(z.any()), // Returns UserProgress[]
      },
    },
    toggle: {
      method: 'POST' as const,
      path: '/api/progress/toggle',
      input: z.object({
        taskId: z.number(),
        date: z.string(), // YYYY-MM-DD
      }),
      responses: {
        200: z.custom<typeof dailyTasks.$inferSelect>(),
      },
    },
  },
  assessment: {
    submit: {
      method: 'POST' as const,
      path: '/api/assessment',
      input: z.object({
        answers: z.any(),
        recommendedLevel: z.number().min(1).max(4),
      }),
      responses: {
        200: z.object({ success: z.boolean(), newLevel: z.number() }),
      },
    },
  },
  billing: {
    upgrade: {
      method: 'POST' as const,
      path: '/api/billing/upgrade',
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    }
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
