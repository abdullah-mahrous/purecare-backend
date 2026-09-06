import { Router } from "express";
import validation from "../../middlewares/validation";
import { idSchema } from "../services/services.validation";
import { careerFieldsSchema } from "./careers.validation";
import { adminOnly } from "../../utilities/adminRoute";
import { memoryUpload } from "../../utilities/upload";
import { appError } from "../../utilities/appError";
import { createCareer, listCareers, deleteCareer } from "./careers.controller";

const router = Router();
const careerUpload = memoryUpload((_req, file, callback) => {
	const allowedTypes = [
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	];
	if (file.mimetype.startsWith("image/") || allowedTypes.includes(file.mimetype)) return callback(null, true);
	callback(new appError("Unsupported file type", 400));
}, { fileSize: 5 * 1024 * 1024, files: 4 });

router.post("/", careerUpload.fields([
	{ name: "nationalId", maxCount: 2 },
	{ name: "graduationCertificate", maxCount: 1 },
	{ name: "professionalLicenseCard", maxCount: 1 },
]), (req, _res, next) => {
	const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
	if (!files?.nationalId?.length) return next(new appError("At least one national ID file is required", 400));
	next();
}, validation(careerFieldsSchema), createCareer);
router.get("/", ...adminOnly, listCareers);
router.delete("/:id", ...adminOnly, validation(idSchema, "params"), deleteCareer);
export default router;