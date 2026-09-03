import { z } from "zod";

const phone = z.string().trim().min(7).max(40);
const optionalNumber = (schema: z.ZodType<number>) => z.preprocess((value) => value === "" ? undefined : value, schema.optional().nullable());

export const careerSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phoneNumber: phone,
  age: optionalNumber(z.coerce.number().int().min(1).max(120)),
  yoe: optionalNumber(z.coerce.number().int().min(0).max(80)),
  address: z.string().trim().min(2).max(300),
  position: z.string().trim().min(2).max(120),
  nationalId: z.string().url(),
  graduationCertificate: z.string().url().nullable().optional(),
  professionalLicenseCard: z.string().url().nullable().optional(),
  workPlaces: z.string().trim().max(1000).optional().nullable(),
}).strict();
