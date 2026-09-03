import { Router } from "express";
import validation from "../../middlewares/validation";
import { idSchema } from "../services/services.validation";
import { testimonialSchema, testimonialPatchSchema } from "./testimonials.validation";
import { adminOnly } from "../../utilities/adminRoute";
import { listTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "./testimonials.controller";

const router = Router();
router.get("/", listTestimonials);
router.post("/", ...adminOnly, validation(testimonialSchema), createTestimonial);
router.patch("/:id", ...adminOnly, validation(idSchema, "params"), validation(testimonialPatchSchema), updateTestimonial);
router.delete("/:id", ...adminOnly, validation(idSchema, "params"), deleteTestimonial);
export default router;