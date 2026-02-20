import { Router } from "express";
import { loginCentre } from "../controllers/accountController";

const accountRouter = Router();

accountRouter.post("/login", loginCentre);

export default accountRouter;
