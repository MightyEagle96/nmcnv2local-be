import { Router } from "express";
import {
  examinationMiddleware,
  getAvatar,
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
  .get("/instructionsummary", authenticateToken, instructionSummary)
  .get("/avatar", authenticateToken, getAvatar);

export default candidateCbtRouter;
