import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createClass,
  deleteClass,
  updateClass,
  getAllClasses,
  updateSection,
  deleteSection,
} from "../controllers/class.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createClass);
router.route("/delete/:id").delete(verifyJWT, deleteClass);
router.route("/update/:id").put(verifyJWT, updateClass);
router.route("/get-all").get(verifyJWT, getAllClasses);
router.route("/update-section/:id").put(verifyJWT, updateSection);
router.route("/delete-section/:id").delete(verifyJWT, deleteSection);

export default router;
