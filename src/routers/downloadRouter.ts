import { Router } from "express";
import {
  authenticateCentre,
  downloadCandidates,
  downloadExamination,
  downloadExamSessions,
  downloadProgrammes,
  downloadQuestionBanks,
  downloadSummary,
} from "../controllers/downloadController.js";

const downloadRouter = Router();

downloadRouter
  .use(authenticateCentre)
  .get("/examination", downloadExamination)
  .get("/programmes", downloadProgrammes)
  .get("/questionbanks", downloadQuestionBanks)
  .get("/sessions", downloadExamSessions)
  .get("/candidates", downloadCandidates)
  .get("/summary", downloadSummary);

export default downloadRouter;
