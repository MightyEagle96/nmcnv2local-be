import { Router } from "express";
import { examinationMiddleware, getAvatar, getQuestions, instructionSummary, loginCandidate, preLoginCandidate, recordInfraction, saveResponses, submitExam, } from "../controllers/cbtController.js";
import { authenticateToken } from "../controllers/jwtController.js";
const candidateCbtRouter = Router();
candidateCbtRouter
    .use(examinationMiddleware)
    .post("/prelogin", preLoginCandidate)
    .get("/login", loginCandidate)
    .get("/instructionsummary", authenticateToken, instructionSummary)
    .get("/avatar", authenticateToken, getAvatar)
    .get("/getquestions", authenticateToken, getQuestions)
    .post("/saveresponses", authenticateToken, saveResponses)
    .post("/submitexam", authenticateToken, submitExam)
    .post("/recordinfraction", authenticateToken, recordInfraction);
export default candidateCbtRouter;
//# sourceMappingURL=candidateCbtRouter.js.map