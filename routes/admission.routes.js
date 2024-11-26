import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  submitAdmissionFrom,
  paymentVerification,
  getApplicationsBasedOnStatus,
  archiveApplication,
  getApplicationById,
  changeCounsellingStatus,
  deleteAdmission,
  updateApplication,
} from "../controllers/admission.controller.js";

const router = Router();

router.route("/").post(upload.single("student_image"), submitAdmissionFrom);
router.route("/verify-payment").post(paymentVerification);
router
  .route("/get-applications/:status")
  .get(verifyJWT, getApplicationsBasedOnStatus);
router.route("/archive-application/:id").delete(verifyJWT, archiveApplication);
router.route("/get-application/:id").get(verifyJWT, getApplicationById);
router
  .route("/change-counselling-status")
  .put(verifyJWT, changeCounsellingStatus);
router.route("/delete/:id").delete(verifyJWT, deleteAdmission);

router
  .route("/update/:id")
  .put(upload.single("changed_image"), updateApplication);

export default router;
