import { Router } from "express";
import {
  examinationMiddleware,
  instructionSummary,
  loginCandidate,
  preLoginCandidate,
} from "../controllers/cbtController.js";
import { authenticateToken } from "../controllers/jwtController.js";

const candidateCbtRouter = Router();

candidateCbtRouter
  .use(examinationMiddleware)
  .post("/prelogin", preLoginCandidate)
  .get("/login", loginCandidate)
  .get("/instructionsummary", authenticateToken, instructionSummary);

export default candidateCbtRouter;
