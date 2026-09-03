import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/database";
import { appError } from "../../utilities/appError";
import { deleteMedia, publicIdFromUrl, uploadImage } from "../../services/cloudinaryService";
import { sendSuccess } from "../../utilities/response";

const getId = (req: Request) => req.params.id as string;
export const listEquipment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, category, minPrice, maxPrice } = req.query as unknown as { page: number; limit: number; search?: string; category?: string; minPrice?: number; maxPrice?: number };
    const where = { AND: [
      ...(search ? [{ OR: [{ nameAr: { contains: search, mode: "insensitive" as const } }, { nameEn: { contains: search, mode: "insensitive" as const } }, { descriptionAr: { contains: search, mode: "insensitive" as const } }, { descriptionEn: { contains: search, mode: "insensitive" as const } }] }] : []),
      ...(category ? [{ OR: [{ categoryAr: { equals: category, mode: "insensitive" as const } }, { categoryEn: { equals: category, mode: "insensitive" as const } }] }] : []),
      ...(minPrice !== undefined || maxPrice !== undefined ? [{ price: { ...(minPrice !== undefined ? { gte: minPrice } : {}), ...(maxPrice !== undefined ? { lte: maxPrice } : {}) } }] : []),
    ] };
    const [items, total] = await prisma.$transaction([
      prisma.equipment.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.equipment.count({ where }),
    ]);
    return sendSuccess(res, { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { return next(error); }
};
export const createEquipment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return next(new appError("An equipment image is required", 400));
    const uploaded = await uploadImage(req.file.buffer, "purecare/equipment");
    try { return sendSuccess(res, await prisma.equipment.create({ data: { ...req.body, imgUrl: uploaded.secure_url } }), 201); }
    catch (error) { await deleteMedia(uploaded.public_id).catch((cleanupError) => console.error("Equipment upload cleanup failed", cleanupError)); throw error; }
  } catch (error) { return next(error); }
};
export const updateEquipment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.equipment.findUniqueOrThrow({ where: { id: getId(req) } });
    const uploaded = req.file ? await uploadImage(req.file.buffer, "purecare/equipment") : undefined;
    try {
      const updated = await prisma.equipment.update({ where: { id: existing.id }, data: { ...req.body, ...(uploaded ? { imgUrl: uploaded.secure_url } : {}) } });
      const oldPublicId = publicIdFromUrl(existing.imgUrl);
      if (uploaded && oldPublicId) await deleteMedia(oldPublicId).catch((error) => console.error("Equipment media cleanup failed", error));
      return sendSuccess(res, updated);
    } catch (error) { if (uploaded) await deleteMedia(uploaded.public_id).catch((cleanupError) => console.error("Equipment upload cleanup failed", cleanupError)); throw error; }
  } catch (error) { return next(error); }
};
export const deleteEquipment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const equipment = await prisma.equipment.delete({ where: { id: getId(req) } });
    const publicId = publicIdFromUrl(equipment.imgUrl);
    if (publicId) await deleteMedia(publicId).catch((error) => console.error("Equipment media cleanup failed", error));
    return res.status(204).send();
  } catch (error) { return next(error); }
};