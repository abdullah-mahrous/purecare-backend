import { z } from "zod";

const url = z.string().url().nullable().optional();

export const siteGlobalDataSchema = z.object({
  whatsappNumber: z.string().trim().max(40).nullable().optional(),
  phoneNumber: z.string().trim().max(40).nullable().optional(),
  emergencyNumber: z.string().trim().max(40).nullable().optional(),
  facebookUrl: url,
  instagramUrl: url,
  tiktokUrl: url,
  introVideoUrl: url,
}).strict();
