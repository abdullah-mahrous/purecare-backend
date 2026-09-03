import { Router } from "express";
import validation from "../../middlewares/validation";
import { loginSchema } from "./auth.validation";
import { login } from "./auth.controller";

const router = Router();
router.post("/login", validation(loginSchema), login);
export default router;