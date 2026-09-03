import { z } from "zod";

export const faqSchema = z.object({
  questionAr: z.string().trim().min(1),
  questionEn: z.string().trim().min(1),
  answerAr: z.string().trim().min(1),
  answerEn: z.string().trim().min(1),
  serviceId: z.string().cuid().nullable().optional(),
}).strict();

export const faqPatchSchema = faqSchema.omit({ serviceId: true }).partial();
