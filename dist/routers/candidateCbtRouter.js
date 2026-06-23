import { Router } from "express";
import { examinationMiddleware, loginCandidate, preLoginCandidate, } from "../controllers/cbtController.js";
const candidateCbtRouter = Router();
candidateCbtRouter
    .use(examinationMiddleware)
    .post("/prelogin", preLoginCandidate)
    .get("/login", loginCandidate);
export default candidateCbtRouter;
//# sourceMappingURL=candidateCbtRouter.js.map