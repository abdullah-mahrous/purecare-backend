import { Request, Response, NextFunction } from "express";
import { appError } from "../utilities/appError";

const adminMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user?.id) return next(new appError("Admin authentication required", 401));
  next();
};

export default adminMiddleware;
