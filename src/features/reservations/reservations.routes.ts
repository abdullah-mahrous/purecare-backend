import { Router } from "express";
import validation from "../../middlewares/validation";
import { reservationSchema } from "./reservations.validation";
import { adminOnly } from "../../utilities/adminRoute";
import { createReservation, listReservations } from "./reservations.controller";

const router = Router();
router.post("/", validation(reservationSchema), createReservation);
router.get("/", ...adminOnly, listReservations);
export default router;