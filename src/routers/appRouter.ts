import { Router } from "express";
import centreRouter from "./centreRouter.js";
import authRouter from "./authRouter.js";
import downloadRouter from "./downloadRouter.js";
import examinationRouter from "./examinationRouter.js";

const appRouter = Router();

appRouter
  .use("/centre", centreRouter)
  .use("/auth", authRouter)
  .use("/download", downloadRouter)
  .use("/examination", examinationRouter);

export default appRouter;
