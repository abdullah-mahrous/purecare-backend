import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/database";
import { sendSuccess } from "../../utilities/response";

const getId = (req: Request) => req.params.id as string;
export const listTestimonials = async (_req: Request, res: Response, next: NextFunction) => {
  try { return sendSuccess(res, await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } })); }
  catch (error) { return next(error); }
};
export const createTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try { return sendSuccess(res, await prisma.testimonial.create({ data: req.body }), 201); }
  catch (error) { return next(error); }
};
export const updateTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try { return sendSuccess(res, await prisma.testimonial.update({ where: { id: getId(req) }, data: req.body })); }
  catch (error) { return next(error); }
};
export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try { await prisma.testimonial.delete({ where: { id: getId(req) } }); return res.status(204).send(); }
  catch (error) { return next(error); }
};