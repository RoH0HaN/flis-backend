import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createEnquiry,
  getEnquiries,
  setEnquiryStatus,
} from "../controllers/enquiry.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createEnquiry);
router.route("/get-all").get(verifyJWT, getEnquiries);
router.route("/set-status").put(verifyJWT, setEnquiryStatus);

export default router;
