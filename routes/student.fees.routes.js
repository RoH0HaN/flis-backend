import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createFeesStructure,
  getFeesStructure,
  addPaymentHistory,
} from "../controllers/student.fees.controller.js";

const router = Router();

router.route("/create-fees-structure").post(verifyJWT, createFeesStructure);
router.route("/get-fees-structure").get(verifyJWT, getFeesStructure);
router.route("/add-payment-history").put(verifyJWT, addPaymentHistory);

export default router;
