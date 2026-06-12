import { Router } from "express";
import { authenticateCentre, downloadExamination, downloadProgrammes, } from "../controllers/downloadController.js";
const downloadRouter = Router();
downloadRouter
    .use(authenticateCentre)
    .get("/examination", downloadExamination)
    .get("/programmes", downloadProgrammes);
export default downloadRouter;
//# sourceMappingURL=downloadRouter.js.map