import { Router } from "express";
import centreRouter from "./centreRouter.js";
import authRouter from "./authRouter.js";
import downloadRouter from "./downloadRouter.js";
import examinationRouter from "./examinationRouter.js";
import candidateCbtRouter from "./candidateCbtRouter.js";
const appRouter = Router();
appRouter
    .use("/centre", centreRouter)
    .use("/auth", authRouter)
    .use("/download", downloadRouter)
    .use("/examination", examinationRouter)
    .use("/cbt", candidateCbtRouter);
export default appRouter;
//# sourceMappingURL=appRouter.js.map