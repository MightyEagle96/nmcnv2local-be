import { Router } from "express";
import { activateSession, activeExaminationAndSession, clearCookie, getCandidate, GetExaminationsWithSessions, reloginAllCandidates, reloginCandidate, testWebSocket, viewSessionCandidates, } from "../controllers/examinationController.js";
import { examinationMiddleware } from "../controllers/cbtController.js";
const examinationRouter = Router();
examinationRouter
    .get("/viewlist", GetExaminationsWithSessions)
    .patch("/activatesession", activateSession)
    .get("/activesession", activeExaminationAndSession)
    .get("/examinationsessioncandidates", examinationMiddleware, viewSessionCandidates)
    .post("/getcandidate", examinationMiddleware, getCandidate)
    .post("/relogincandidate", examinationMiddleware, reloginCandidate)
    .post("/messagecandidate", examinationMiddleware, testWebSocket)
    .get("/reloginallcandidates", examinationMiddleware, reloginAllCandidates)
    .get("/clearcookie", clearCookie);
export default examinationRouter;
//# sourceMappingURL=examinationRouter.js.map