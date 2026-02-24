import { Router } from "express";
import adminRouter from "./admin/routers/adminRouter";

const appRouter = Router();

appRouter.use("/admin", adminRouter);

export default appRouter;
