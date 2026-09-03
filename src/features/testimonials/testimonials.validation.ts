import { z } from "zod";

export const testimonialSchema = z.object({
  nameAr: z.string().trim().min(1),
  nameEn: z.string().trim().min(1),
  gender: z.string().trim().min(1).max(30),
  commentAr: z.string().trim().min(1),
  commentEn: z.string().trim().min(1),
}).strict();

export const testimonialPatchSchema = testimonialSchema.partial();
