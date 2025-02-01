import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addHealthRecord,
  getHealthRecordOfStudent,
  deleteDietChartFromHealthRecord,
} from "../controllers/health.record.controller.js";

const router = Router();

router
  .route("/create/:studentId")
  .put(verifyJWT, upload.single("dietchart"), addHealthRecord);
router
  .route("/get-by-student/:studentId")
  .get(verifyJWT, getHealthRecordOfStudent);

router
  .route("/delete-diet-chart")
  .delete(verifyJWT, deleteDietChartFromHealthRecord);

export default router;
