import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createClass,
  deleteClass,
  updateClass,
  getAllClasses,
} from "../controllers/class.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createClass);
router.route("/delete/:id").delete(verifyJWT, deleteClass);
router.route("/update/:id").put(verifyJWT, updateClass);
router.route("/get-all").get(verifyJWT, getAllClasses);

export default router;
