import { z } from "zod";

const bilingualText = { nameAr: z.string().trim().min(1), nameEn: z.string().trim().min(1) };

export const idSchema = z.object({ id: z.string().cuid() }).strict();
export const serviceChildParamsSchema = z.object({ serviceId: z.string().cuid(), id: z.string().cuid() }).strict();
export const serviceParentParamsSchema = z.object({ serviceId: z.string().cuid() }).strict();

export const serviceSchema = z.object({
  ...bilingualText,
  descriptionAr: z.string().trim().min(1),
  descriptionEn: z.string().trim().min(1),
  rate: z.coerce.number().nonnegative(),
  customersCount: z.coerce.number().int().nonnegative().optional(),
  responseTime: z.string().trim().nullable().optional(),
}).strict();

const includedServiceFields = {
  titleAr: z.string().trim().min(1),
  titleEn: z.string().trim().min(1),
  descriptionAr: z.string().trim().min(1),
  descriptionEn: z.string().trim().min(1),
};
export const includedServiceCreateSchema = z.object(includedServiceFields).strict();
export const includedServicePatchSchema = z.object(includedServiceFields).partial().strict();

const targetedCustomerFields = {
  titleAr: z.string().trim().min(1),
  titleEn: z.string().trim().min(1),
  descriptionAr: z.string().trim().min(1),
  descriptionEn: z.string().trim().min(1),
};
export const targetedCustomerCreateSchema = z.object(targetedCustomerFields).strict();
export const targetedCustomerPatchSchema = z.object(targetedCustomerFields).partial().strict();

export const serviceWriteSchema = serviceSchema.strict();
export const servicePatchSchema = serviceSchema.partial().strict();
