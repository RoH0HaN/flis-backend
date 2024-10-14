import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  submitAdmissionFrom,
  paymentVerification,
} from "../controllers/admission.controller.js";

const router = Router();

router
  .route("/")
  .post(upload.single("student_details[student_image]"), submitAdmissionFrom);
router.route("/verify-payment").post(paymentVerification);

export default router;
