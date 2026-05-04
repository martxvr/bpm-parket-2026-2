import { z } from 'zod';

export const chatHistorySchema = z
  .array(
    z.object({
      role: z.enum(['user', 'assistant']),
      text: z.string().max(4000),
    }),
  )
  .max(50);

export const chatRequestSchema = z.object({
  history: chatHistorySchema,
  message: z.string().min(1).max(1000),
  sessionId: z.string().uuid(),
});
