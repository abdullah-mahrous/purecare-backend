import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/database";
import { sendSuccess } from "../../utilities/response";

const faqSelect = { id: true, questionAr: true, questionEn: true, answerAr: true, answerEn: true, createdAt: true, updatedAt: true } as const;
const getId = (req: Request) => req.params.id as string;

export const listFaqs = async (_req: Request, res: Response, next: NextFunction) => {
  try { return sendSuccess(res, await prisma.faq.findMany({ where: { serviceId: null }, select: faqSelect, orderBy: { createdAt: "desc" } })); }
  catch (error) { return next(error); }
};
export const createFaq = async (req: Request, res: Response, next: NextFunction) => {
  try { return sendSuccess(res, await prisma.faq.create({ data: req.body }), 201); }
  catch (error) { return next(error); }
};
export const updateFaq = async (req: Request, res: Response, next: NextFunction) => {
  try { return sendSuccess(res, await prisma.faq.update({ where: { id: getId(req) }, data: req.body })); }
  catch (error) { return next(error); }
};
export const deleteFaq = async (req: Request, res: Response, next: NextFunction) => {
  try { await prisma.faq.delete({ where: { id: getId(req) } }); return res.status(204).send(); }
  catch (error) { return next(error); }
};