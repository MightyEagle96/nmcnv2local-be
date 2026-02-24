import { Router } from "express";
import authRouter from "./authRouter";

const adminRouter = Router();

adminRouter.use("/auth", authRouter);

export default adminRouter;
