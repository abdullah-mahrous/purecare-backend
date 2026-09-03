import authMiddleware from "../middlewares/authMiddleware";
import adminMiddleware from "../middlewares/adminMiddleware";

export const adminOnly = [authMiddleware, adminMiddleware];