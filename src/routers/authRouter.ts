import { Router } from "express";
import {
  getRefreshToken,
  myProfile,
  logoutAccount,
} from "../controllers/authController.js";
import { authenticateToken } from "../controllers/jwtController.js";

const authRouter = Router();

authRouter
  .get("/profile", authenticateToken, myProfile)
  .get("/refresh", getRefreshToken)
  .get("/logout", logoutAccount);
export default authRouter;
