import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/database";
import { deleteMedia, publicIdFromUrl, uploadImage } from "../../services/cloudinaryService";
import { appError } from "../../utilities/appError";
import { sendSuccess } from "../../utilities/response";

const include = { faqs: { select: { id: true, questionAr: true, questionEn: true, answerAr: true, answerEn: true, createdAt: true, updatedAt: true } }, included: true, targeted: true } as const;
const getId = (req: Request) => req.params.id as string;

export const listServices = async (_req: Request, res: Response, next: NextFunction) => {
  try { return sendSuccess(res, await prisma.service.findMany({ include, orderBy: { createdAt: "desc" } })); }
  catch (error) { return next(error); }
};
export const getService = async (req: Request, res: Response, next: NextFunction) => {
  try { return sendSuccess(res, await prisma.service.findUniqueOrThrow({ where: { id: getId(req) }, include })); }
  catch (error) { return next(error); }
};

const deleteCloudinaryMedia = (urls: Array<string | null | undefined>, message: string) =>
  Promise.all(urls.map(publicIdFromUrl).filter((id): id is string => Boolean(id)).map((id) => deleteMedia(id).catch((error) => console.error(message, error))));

export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return next(new appError("A service image is required", 400));
    const uploaded = await uploadImage(req.file.buffer, "purecare/services");
    const created = await prisma.$transaction((transaction) => transaction.service.create({
      data: { ...req.body, imgUrl: uploaded.secure_url },
      include,
    }));
    return sendSuccess(res, created, 201);
  } catch (error) { return next(error); }
};

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getId(req);
    const existing = await prisma.service.findUniqueOrThrow({ where: { id } });
    const uploaded = req.file ? await uploadImage(req.file.buffer, "purecare/services") : undefined;
    const updated = await prisma.service.update({ where: { id }, data: { ...req.body, ...(uploaded ? { imgUrl: uploaded.secure_url } : {}) }, include });
    if (uploaded) await deleteCloudinaryMedia([existing.imgUrl], "Service media cleanup failed");
    return sendSuccess(res, updated);
  } catch (error) { return next(error); }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await prisma.service.delete({ where: { id: getId(req) }, include: { included: true, targeted: true } });
    await deleteCloudinaryMedia([service.imgUrl, ...service.included.map(({ iconUrl }) => iconUrl), ...service.targeted.map(({ iconUrl }) => iconUrl)], "Service media cleanup failed");
    return res.status(204).send();
  } catch (error) { return next(error); }
};