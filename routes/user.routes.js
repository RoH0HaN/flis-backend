import { Router } from "express";
import {
  createUser,
  loginUser,
  logout,
  refreshAccessToken,
  changePassword,
  getCurrentUserDetails,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/sign-up").post(createUser);
router.route("/log-in").post(loginUser);
router.route("/log-out").post(verifyJWT, logout);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/get-current-admin").get(verifyJWT, getCurrentUserDetails);

export default router;
