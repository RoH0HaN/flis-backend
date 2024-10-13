import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { submitAdmissionFrom } from "../controllers/admission.controller.js";

const router = Router();

router.route("/").post(upload.single("student_image"), submitAdmissionFrom);

export default router;
