import { Router } from "express";
import {
  examinationMiddleware,
  preLoginCandidate,
} from "../controllers/cbtController.js";

const candidateCbtRouter = Router();

candidateCbtRouter.post("/prelogin", examinationMiddleware, preLoginCandidate);

export default candidateCbtRouter;
