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
  getAllGroupsForDropdown,
  getAllMasters,
  getHeaderById,
  updateHeader,
  deleteHeader,
  getGroupById,
  updateGroup,
  deleteGroup,
  deleteMaster,
} from "../controllers/fees.controller.js";

const router = Router();

router.route("/header/create").post(verifyJWT, createFeesHeader);
router.route("/header/get/:id").get(verifyJWT, getHeaderById);
router.route("/header/get-all").get(getAllHeaders);
router.route("/header/update").put(updateHeader);
router.route("/header/delete/:id").delete(deleteHeader);
router.route("/group/create").post(createFeesGroup);
router.route("/group/get-all").get(getAllGroups);
router.route("/group/get-all-for-dropdown").get(getAllGroupsForDropdown);
router.route("/group/get/:id").get(getGroupById);
router.route("/group/update").put(updateGroup);
router.route("/group/delete/:id").delete(deleteGroup);
router.route("/master/create").post(createFeesMaster);
router.route("/master/set-amount").put(setAmount);
router.route("/master/delete-header").put(deleteHeaderInMaster);
router.route("/master/add-header").put(addHeaderToMaster);
router.route("/master/get-all").get(getAllMasters);
router.route("/master/delete/:id").delete(deleteMaster);

export default router;
