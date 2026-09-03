import { z } from "zod";

const phone = z.string().trim().min(7).max(40);
const optionalNumber = (schema: z.ZodType<number>) => z.preprocess((value) => value === "" ? undefined : value, schema.optional().nullable());

export const reservationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phoneNumber: phone,
  age: optionalNumber(z.coerce.number().int().min(1).max(120)),
  desiredDate: z.coerce.date(),
  address: z.string().trim().min(2).max(300),
  serviceIds: z.array(z.string().cuid()).max(20).optional().nullable(),
  healthIssue: z.string().trim().min(2).max(2000).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
}).strict();
