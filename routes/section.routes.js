import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createSection } from "../controllers/class.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createSection);

export default router;
