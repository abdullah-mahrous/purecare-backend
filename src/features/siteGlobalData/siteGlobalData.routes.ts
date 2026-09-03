import { Router } from "express";
import validation from "../../middlewares/validation";
import { siteGlobalDataSchema } from "./siteGlobalData.validation";
import { adminOnly } from "../../utilities/adminRoute";
import { getSiteGlobalData, updateSiteGlobalData } from "./siteGlobalData.controller";

const router = Router();
router.get("/", getSiteGlobalData);
router.patch("/", ...adminOnly, validation(siteGlobalDataSchema), updateSiteGlobalData);
export default router;