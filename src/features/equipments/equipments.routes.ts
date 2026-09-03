import { Router } from "express";
import validation from "../../middlewares/validation";
import { idSchema } from "../services/services.validation";
import { equipmentCreateSchema, equipmentPatchSchema, equipmentPaginationSchema } from "./equipments.validation";
import { adminOnly } from "../../utilities/adminRoute";
import { memoryUpload } from "../../utilities/upload";
import { listEquipment, createEquipment, updateEquipment, deleteEquipment } from "./equipments.controller";

const router = Router();
const equipmentUpload = memoryUpload();
router.get("/", validation(equipmentPaginationSchema, "query"), listEquipment);
router.post("/", ...adminOnly, equipmentUpload.single("equipmentImg"), validation(equipmentCreateSchema), createEquipment);
router.patch("/:id", ...adminOnly, equipmentUpload.single("equipmentImg"), validation(idSchema, "params"), validation(equipmentPatchSchema), updateEquipment);
router.delete("/:id", ...adminOnly, validation(idSchema, "params"), deleteEquipment);
export default router;