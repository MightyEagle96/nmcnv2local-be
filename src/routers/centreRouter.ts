import { Router } from "express";
import { LoginCentre } from "../controllers/centreController.js";

const centreRouter = Router();

centreRouter.post("/login", LoginCentre);

export default centreRouter;
