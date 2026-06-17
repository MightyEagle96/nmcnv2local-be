import { Router } from "express";
import {
  activateSession,
  activeExaminationAndSession,
  GetExaminationsWithSessions,
  viewSessionCandidates,
} from "../controllers/examinationController.js";
import { examinationMiddleware } from "../controllers/cbtController.js";

const examinationRouter = Router();

examinationRouter
  .get("/viewlist", GetExaminationsWithSessions)
  .patch("/activatesession", activateSession)
  .get("/activesession", activeExaminationAndSession)
  .get(
    "/examinationsessioncandidates",
    examinationMiddleware,
    viewSessionCandidates,
  );

export default examinationRouter;
