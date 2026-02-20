import express, { Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { ConnectDatabase } from "./database";
import appRouter from "./appRouter";

dotenv.config();

const app = express();

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowed = [
      /^http:\/\/(localhost|127\.0\.0\.1):3000$/,
      /^http:\/\/localhost:4000$/,
      /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/,
      /^http:\/\/172\.16\.\d+\.\d+(:\d+)?$/,
      /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/,
    ];

    if (!origin || allowed.some((regex) => regex.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

ConnectDatabase();

app
  .use(cookieParser())

  // Only log in development
  .use(
    process.env.NODE_ENV === "development"
      ? morgan("dev")
      : (req, res, next) => next(),
  )

  .use(express.json({ limit: "50mb" }))

  .use(cors(corsOptions))

  .use(express.static(path.join(__dirname, "build")))

  .use("/api", appRouter)

  .get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  })

  .listen(4000, "0.0.0.0", () => {
    console.log("server started on http://localhost:4000");
  });

export const appRoles = {
  admin: "admin",
  cbtCandidate: "cbtCandidate",
  procedureExaminer: "procedureExaminer",
  questionStationCandidate: "questionStationCandidate",
};
