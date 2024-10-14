import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { sendEmailAndSmsForCounselling } from "../controllers/communication.controller.js";

const router = Router();

router.route("/counselling").post(sendEmailAndSmsForCounselling);

export default router;
