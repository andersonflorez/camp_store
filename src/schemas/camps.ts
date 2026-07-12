import { z } from "zod";

export const campSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Debe tener al menos 3 caracteres")
    .max(100),

  slug: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Usa solo letras minúsculas, números y guiones"),
});

export type CampForm = z.infer<typeof campSchema>;