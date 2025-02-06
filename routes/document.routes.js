import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createDocument,
  deleteDocument,
  getStudentDocuments,
  generateAgreementPdf,
} from "../controllers/document.controller.js";

const router = Router();

router
  .route("/create")
  .post(verifyJWT, upload.single("document"), createDocument);
router.route("/delete/:id").delete(verifyJWT, deleteDocument);
router.route("/get-student-documents/:student").get(getStudentDocuments);
router
  .route("/generate-agreement-pdf/:feesStructureId")
  .get(generateAgreementPdf);

export default router;
