import { Router } from "express";
import centreRouter from "./centreRouter.js";
import authRouter from "./authRouter.js";
import downloadRouter from "./downloadRouter.js";
const appRouter = Router();
appRouter
    .use("/centre", centreRouter)
    .use("/auth", authRouter)
    .use("/download", downloadRouter);
export default appRouter;
//# sourceMappingURL=appRouter.js.map