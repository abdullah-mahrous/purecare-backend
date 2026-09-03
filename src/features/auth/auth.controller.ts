import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/database";
import enVars from "../../config/environment";
import { appError } from "../../utilities/appError";
import { sendSuccess } from "../../utilities/response";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.toLowerCase().trim() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return next(new appError("Invalid email or password", 401));
    }
    const token = jwt.sign({ id: admin.id, email: admin.email, name: admin.name }, enVars.jwt.secret, {
      expiresIn: enVars.jwt.expire ?? "7d",
    });
    return sendSuccess(res, { token, admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch (error) {
    return next(error);
  }
};