import { Router } from "express";
import {
  activateSession,
  activeExaminationAndSession,
  GetExaminationsWithSessions,
} from "../controllers/examinationController.js";

const examinationRouter = Router();

examinationRouter
  .get("/viewlist", GetExaminationsWithSessions)
  .patch("/activatesession", activateSession)
  .get("/activesession", activeExaminationAndSession);

export default examinationRouter;
