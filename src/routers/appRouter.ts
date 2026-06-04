import { Router } from "express";
import centreRouter from "./centreRouter.js";
import authRouter from "./authRouter.js";

const appRouter = Router();

appRouter.use("/centre", centreRouter).use("/auth", authRouter);

export default appRouter;
