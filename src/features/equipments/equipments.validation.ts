import { z } from "zod";

const bilingualText = { nameAr: z.string().trim().min(1), nameEn: z.string().trim().min(1) };
const equipmentFields = {
  ...bilingualText,
  descriptionAr: z.string().trim().min(1),
  descriptionEn: z.string().trim().min(1),
  categoryAr: z.string().trim().min(1),
  categoryEn: z.string().trim().min(1),
  price: z.coerce.number().nonnegative(),
  imgUrl: z.string().url().nullable().optional(),
  available: z.boolean().optional(),
};

const parseBoolean = (value: unknown) => value === "true" ? true : value === "false" ? false : value;

export const equipmentSchema = z.object(equipmentFields).strict();
export const equipmentPatchSchema = equipmentSchema.omit({ imgUrl: true }).partial().extend({
  available: z.preprocess(parseBoolean, z.boolean().optional()),
});
export const equipmentCreateSchema = equipmentSchema.omit({ imgUrl: true }).extend({
  available: z.preprocess(parseBoolean, z.boolean().optional()),
});

export const equipmentPaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(100).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
}).refine((value) => value.minPrice === undefined || value.maxPrice === undefined || value.minPrice <= value.maxPrice, {
  message: "minPrice must be less than or equal to maxPrice",
});
