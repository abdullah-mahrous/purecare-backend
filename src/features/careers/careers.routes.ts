import { Router } from "express";
import validation from "../../middlewares/validation";
import { idSchema } from "../services/services.validation";
import { careerSchema } from "./careers.validation";
import { adminOnly } from "../../utilities/adminRoute";
import { createCareer, listCareers, deleteCareer } from "./careers.controller";

const router = Router();
router.post("/", validation(careerSchema), createCareer);
router.get("/", ...adminOnly, listCareers);
router.delete("/:id", ...adminOnly, validation(idSchema, "params"), deleteCareer);
export default router;