import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(2, 'Naam is verplicht').max(100),
  email: z.string().email('Ongeldig emailadres').max(200),
  phone: z
    .string()
    .min(10, 'Telefoonnummer is te kort')
    .max(20, 'Telefoonnummer is te lang')
    .regex(/^[0-9 +()-]+$/, 'Alleen cijfers en spaties toegestaan'),
  floor_type: z.string().max(50).optional(),
  area_size: z.coerce.number().int().min(0).max(10000).optional(),
  message: z.string().max(2000).optional(),
  source: z.string().max(50),
  // Honeypot — must be empty
  website: z.string().max(0, 'Bot detected').optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
