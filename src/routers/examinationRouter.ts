import { Router } from "express";
import {
  activateSession,
  activeExaminationAndSession,
  clearCookie,
  endSession,
  getCandidate,
  GetExaminationsWithSessions,
  getInfractionCandidate,
  reloginAllCandidates,
  reloginCandidate,
  testWebSocket,
  unflagCandidate,
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
  )
  .post("/getcandidate", examinationMiddleware, getCandidate)
  .post("/relogincandidate", examinationMiddleware, reloginCandidate)
  .post("/messagecandidate", examinationMiddleware, testWebSocket)
  .get("/reloginallcandidates", examinationMiddleware, reloginAllCandidates)
  .post("/infractioncandidate", examinationMiddleware, getInfractionCandidate)
  .post("/unflagcandidate", examinationMiddleware, unflagCandidate)
  .patch("/endsession", examinationMiddleware, endSession)
  .get("/clearcookie", clearCookie);

export default examinationRouter;
