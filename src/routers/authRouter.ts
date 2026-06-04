import { Router } from "express";
import { myProfile } from "../controllers/authController.js";

const authRouter = Router();

authRouter.get("/profile", myProfile);
export default authRouter;
