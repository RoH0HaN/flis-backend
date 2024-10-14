import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createFeesHeader,
  createFeesGroup,
} from "../controllers/fees.controller.js";

const router = Router();

router.route("/header/create").post(createFeesHeader);
router.route("/group/create").post(createFeesGroup);

export default router;
