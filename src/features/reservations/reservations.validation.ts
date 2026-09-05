import { z } from "zod";

const phone = z.string().trim().min(7).max(40);
const optionalNumber = (schema: z.ZodType<number>) => z.preprocess((value) => value === "" ? undefined : value, schema.optional().nullable());
const optionalText = (schema: z.ZodType<string>) => z.preprocess((value) => {
  if (value === null || value === undefined) return value;
  if (typeof value === "string" && value.trim() === "") return "";
  return value;
}, schema.optional().nullable());

export const reservationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phoneNumber: phone,
  age: optionalNumber(z.coerce.number().int().min(0).max(120)),
  desiredDate: z.coerce.date(),
  address: z.string().trim().min(2).max(300),
  serviceIds: z.array(z.string().cuid()).max(20).optional().nullable(),
  healthIssue: optionalText(z.string().trim().max(2000)),
  notes: optionalText(z.string().trim().max(2000)),
}).strict();
