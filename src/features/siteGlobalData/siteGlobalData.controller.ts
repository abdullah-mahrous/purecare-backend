import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/database";
import { sendSuccess } from "../../utilities/response";

export const getSiteGlobalData = async (_req: Request, res: Response, next: NextFunction) => {
  try { return sendSuccess(res, await prisma.websiteGeneralData.findUnique({ where: { id: "singleton" } })); }
  catch (error) { return next(error); }
};

export const updateSiteGlobalData = async (req: Request, res: Response, next: NextFunction) => {
  try { return sendSuccess(res, await prisma.websiteGeneralData.upsert({ where: { id: "singleton" }, create: req.body, update: req.body })); }
  catch (error) { return next(error); }
};