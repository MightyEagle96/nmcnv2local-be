import { Router } from "express";
import { GetExaminationsWithSessions } from "../controllers/examinationController.js";

const examinationRouter = Router();

examinationRouter.get("/viewlist", GetExaminationsWithSessions);

export default examinationRouter;
