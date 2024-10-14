import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createFeesHeader,
  createFeesGroup,
  updateFeesGroup,
} from "../controllers/fees.controller.js";

const router = Router();

router.route("/header/create").post(createFeesHeader);
router.route("/group/create").post(createFeesGroup);
router.route("/group/update").put(updateFeesGroup);

export default router;
