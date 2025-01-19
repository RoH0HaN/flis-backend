import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addHealthRecord } from "../controllers/health.record.controller.js";

const router = Router();

router
  .route("/create/:studentId")
  .put(verifyJWT, upload.single("dietchart"), addHealthRecord);

export default router;
