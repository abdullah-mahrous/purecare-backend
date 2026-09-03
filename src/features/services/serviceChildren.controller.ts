import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/database";
import { deleteMedia, publicIdFromUrl, uploadImage } from "../../services/cloudinaryService";
import { appError } from "../../utilities/appError";
import { sendSuccess } from "../../utilities/response";

const getServiceId = (req: Request) => req.params.serviceId as string;
const getChildId = (req: Request) => req.params.id as string;

const deleteIcon = async (iconUrl: string | null | undefined, message: string) => {
  const publicId = publicIdFromUrl(iconUrl);
  if (publicId) await deleteMedia(publicId).catch((error) => console.error(message, error));
};

export const createIncludedService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return next(new appError("An included service icon is required", 400));
    const uploaded = await uploadImage(req.file.buffer, "purecare/services/included");
    const item = await prisma.includedService.create({ data: { ...req.body, iconUrl: uploaded.secure_url, serviceId: getServiceId(req) } });
    return sendSuccess(res, item, 201);
  } catch (error) { return next(error); }
};

export const updateIncludedService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.includedService.findFirstOrThrow({ where: { id: getChildId(req), serviceId: getServiceId(req) } });
    const uploaded = req.file ? await uploadImage(req.file.buffer, "purecare/services/included") : undefined;
    const updated = await prisma.includedService.update({ where: { id: existing.id }, data: { ...req.body, ...(uploaded ? { iconUrl: uploaded.secure_url } : {}) } });
    if (uploaded) await deleteIcon(existing.iconUrl, "Included service media cleanup failed");
    return sendSuccess(res, updated);
  } catch (error) { return next(error); }
};

export const deleteIncludedService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await prisma.includedService.findFirstOrThrow({ where: { id: getChildId(req), serviceId: getServiceId(req) } });
    await prisma.includedService.delete({ where: { id: item.id } });
    await deleteIcon(item.iconUrl, "Included service media cleanup failed");
    return res.status(204).send();
  } catch (error) { return next(error); }
};

export const createTargetedCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return next(new appError("A targeted customer icon is required", 400));
    const uploaded = await uploadImage(req.file.buffer, "purecare/services/targeted");
    const item = await prisma.targetedCustomer.create({ data: { ...req.body, iconUrl: uploaded.secure_url, serviceId: getServiceId(req) } });
    return sendSuccess(res, item, 201);
  } catch (error) { return next(error); }
};

export const updateTargetedCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.targetedCustomer.findFirstOrThrow({ where: { id: getChildId(req), serviceId: getServiceId(req) } });
    const uploaded = req.file ? await uploadImage(req.file.buffer, "purecare/services/targeted") : undefined;
    const updated = await prisma.targetedCustomer.update({ where: { id: existing.id }, data: { ...req.body, ...(uploaded ? { iconUrl: uploaded.secure_url } : {}) } });
    if (uploaded) await deleteIcon(existing.iconUrl, "Targeted customer media cleanup failed");
    return sendSuccess(res, updated);
  } catch (error) { return next(error); }
};

export const deleteTargetedCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await prisma.targetedCustomer.findFirstOrThrow({ where: { id: getChildId(req), serviceId: getServiceId(req) } });
    await prisma.targetedCustomer.delete({ where: { id: item.id } });
    await deleteIcon(item.iconUrl, "Targeted customer media cleanup failed");
    return res.status(204).send();
  } catch (error) { return next(error); }
};