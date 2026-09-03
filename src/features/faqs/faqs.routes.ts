import { Router } from "express";
import validation from "../../middlewares/validation";
import { idSchema } from "../services/services.validation";
import { faqSchema, faqPatchSchema } from "./faqs.validation";
import { adminOnly } from "../../utilities/adminRoute";
import { listFaqs, createFaq, updateFaq, deleteFaq } from "./faqs.controller";

const router = Router();
router.get("/", listFaqs);
router.post("/", ...adminOnly, validation(faqSchema), createFaq);
router.patch("/:id", ...adminOnly, validation(idSchema, "params"), validation(faqPatchSchema), updateFaq);
router.delete("/:id", ...adminOnly, validation(idSchema, "params"), deleteFaq);
export default router;