import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createStudent,
  getCurrentStatus,
} from "../controllers/student.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createStudent);
router
  .route("/get-current-status/:application_id")
  .get(verifyJWT, getCurrentStatus);

export default router;
