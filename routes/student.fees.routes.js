import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createFeesStructure } from "../controllers/student.fees.controller.js";

const router = Router();

router.route("/create-fees-structure").post(createFeesStructure);

export default router;
