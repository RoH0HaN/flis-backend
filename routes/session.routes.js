import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createSession,
  deleteSession,
  getAllSessions,
} from "../controllers/session.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createSession);
router.route("/delete/:id").delete(verifyJWT, deleteSession);
router.route("/get-all").get(verifyJWT, getAllSessions);

export default router;
