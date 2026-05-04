import { z } from 'zod';

export const leadStatusSchema = z.enum(['new', 'contacted', 'completed']);

export const leadUpdateSchema = z.object({
  id: z.string().uuid(),
  status: leadStatusSchema,
});

export const appointmentStatusSchema = z.enum([
  'pending',
  'confirmed',
  'cancelled',
]);

export const appointmentUpdateSchema = z.object({
  id: z.string().uuid(),
  status: appointmentStatusSchema,
});

export const knowledgeUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  topic: z.string().min(1, 'Onderwerp is verplicht').max(200),
  content: z.string().min(1, 'Inhoud is verplicht').max(5000),
});

export const serviceUpdateSchema = z.object({
  slug: z.string().min(1).max(100),
  title: z.string().min(1, 'Titel is verplicht').max(200),
  meta_title: z.string().max(200).optional(),
  meta_description: z.string().max(300).optional(),
  body_md: z.string().max(20000).optional(),
  hero_image: z.string().url().optional().or(z.literal('')),
  sort_order: z.coerce.number().int().min(0).optional(),
});

export const projectUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(1, 'Slug is verplicht')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Alleen kleine letters, cijfers en streepjes'),
  title: z.string().min(1, 'Titel is verplicht').max(200),
  description: z.string().max(500).optional(),
  long_description: z.string().max(5000).optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  area_size: z.coerce.number().int().min(0).max(10000).optional(),
  location: z.string().max(100).optional(),
  completed_date: z.string().optional(),
  floor_type: z.string().max(50).optional(),
  is_featured: z.coerce.boolean().optional(),
  sort_order: z.coerce.number().int().min(0).optional(),
});

export const adminSettingsSchema = z.object({
  chatbot_enabled: z.coerce.boolean(),
  system_prompt_extra: z.string().max(2000).optional(),
  phone: z.string().max(20).optional(),
  whatsapp: z.string().max(20).optional(),
});
