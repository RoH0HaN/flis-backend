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
  getAllGroups,
  getAllMasters,
  getHeaderById,
  updateHeader,
} from "../controllers/fees.controller.js";

const router = Router();

router.route("/header/create").post(createFeesHeader);
router.route("/group/create").post(createFeesGroup);
router.route("/master/create").post(createFeesMaster);
router.route("/master/set-amount").put(setAmount);
router.route("/master/delete-header").put(deleteHeaderInMaster);
router.route("/master/add-header").put(addHeaderToMaster);
router.route("/header/get-all").get(getAllHeaders);
router.route("/group/get-all").get(getAllGroups);
router.route("/master/get-all").get(getAllMasters);
router.route("/header/get/:id").get(getHeaderById);
router.route("/header/update").put(updateHeader);

export default router;
