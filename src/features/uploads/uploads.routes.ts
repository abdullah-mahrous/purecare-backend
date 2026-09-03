import { Router } from "express";
import { adminOnly } from "../../utilities/adminRoute";
import { anyFileUpload } from "../../utilities/upload";
import validation from "../../middlewares/validation";
import { deleteUploadSchema } from "./uploads.validation";
import { upload, deleteUpload } from "./uploads.controller";

const router = Router();
router.post("/", ...adminOnly, anyFileUpload.single("file"), upload);
router.delete("/", ...adminOnly, validation(deleteUploadSchema), deleteUpload);
export default router;