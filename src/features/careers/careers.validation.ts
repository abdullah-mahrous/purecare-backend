import { z } from "zod";

const phone = z.string().trim().min(4).max(20);
const optionalNumber = (schema: z.ZodType<number>) => z.preprocess((value) => value === "" ? undefined : value, schema.optional().nullable());
const optionalText = (schema: z.ZodType<string>) => z.preprocess((value) => {
  if (value === null || value === undefined) return value;
  if (typeof value === "string" && value.trim() === "") return "";
  return value;
}, schema.optional().nullable());

export const careerSchema = z.object({
  fullName: z.string().trim().min(6).max(256),
  phoneNumber: phone,
  age: optionalNumber(z.coerce.number().int().min(0)),
  yoe: optionalNumber(z.coerce.number().int().min(0)),
  address: z.string().trim().min(1),
  position: z.string().trim().min(1),
  nationalId: z.union([z.string().url(), z.array(z.string().url()).min(1).max(2)]),
  graduationCertificate: z.union([z.string().url(), z.array(z.string().url()).max(1)]).nullable().optional(),
  professionalLicenseCard: z.union([z.string().url(), z.array(z.string().url()).max(1)]).nullable().optional(),
  workPlaces: optionalText(z.string().trim().max(1000)),
}).strict();

export const careerFieldsSchema = careerSchema.omit({
  nationalId: true,
  graduationCertificate: true,
  professionalLicenseCard: true,
});
