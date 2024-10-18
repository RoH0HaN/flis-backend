import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createFeesHeader,
  createFeesGroup,
  createFeesMaster,
  setAmount,
  deleteHeaderInMaster,
  addHeaderToMaster,
  getAllHeaders,
} from "../controllers/fees.controller.js";

const router = Router();

router.route("/header/create").post(createFeesHeader);
router.route("/group/create").post(createFeesGroup);
router.route("/master/create").post(createFeesMaster);
router.route("/master/set-amount").put(setAmount);
router.route("/master/delete-header").put(deleteHeaderInMaster);
router.route("/master/add-header").put(addHeaderToMaster);
router.route("/header/get-all").get(getAllHeaders);

export default router;
