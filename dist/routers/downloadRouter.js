import { Router } from "express";
import { authenticateCentre, downloadCandidates, downloadExamination, downloadExamSessions, downloadProgrammes, downloadQuestionBanks, } from "../controllers/downloadController.js";
const downloadRouter = Router();
downloadRouter
    .use(authenticateCentre)
    .get("/examination", downloadExamination)
    .get("/programmes", downloadProgrammes)
    .get("/questionbanks", downloadQuestionBanks)
    .get("/sessions", downloadExamSessions)
    .get("/candidates", downloadCandidates);
export default downloadRouter;
//# sourceMappingURL=downloadRouter.js.map