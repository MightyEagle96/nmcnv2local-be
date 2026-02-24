import { Router } from "express";
import { loginCentre } from "../controllers/accountController";

const authRouter = Router();

authRouter.post("/login", loginCentre);

export default authRouter;
