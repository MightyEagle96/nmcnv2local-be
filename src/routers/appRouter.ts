import { Router } from "express";
import centreRouter from "./centreRouter.js";

const appRouter = Router();

appRouter.use("/centre", centreRouter);

export default appRouter;
