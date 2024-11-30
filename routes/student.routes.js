import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createStudent,
  getCurrentStatus,
  getStudentsByStatus,
} from "../controllers/student.controller.js";

const router = Router();

router.route("/create/:application_id").post(verifyJWT, createStudent);
router
  .route("/get-current-status/:application_id")
  .get(verifyJWT, getCurrentStatus);
router.route("/get-students/:status").get(verifyJWT, getStudentsByStatus);

export default router;
