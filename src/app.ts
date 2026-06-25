import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { ConnectDatabase } from "./database.js";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import appRouter from "./routers/appRouter.js";
import { Server } from "socket.io";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config();

const whitelist = ["http://localhost:5173", "http://localhost:4002"];

ConnectDatabase();

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isLocalhost =
      origin.includes("localhost") || origin.includes("127.0.0.1");

    const isLAN =
      /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin) ||
      /^http:\/\/172\.20\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin) ||
      /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin);

    if (isLocalhost || isLAN || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
};

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`a user connected,  ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`user disconnected, ${socket.id}`);
  });

  socket.on("join-exam", ({ candidateId }) => {
    const room = `candidate:${candidateId}`;

    socket.join(room);

    console.log(`Socket ${socket.id} joined room ${room}`);
  });
});

app
  .use(cors(corsOptions))

  .use(cookieParser())

  .use(morgan("dev"))

  .use(express.json({ limit: "50mb" }))

  .use("/api", appRouter)

  .use(express.static(path.join(__dirname, "build")));

server.listen(4001, () => console.log(`Server is running on port ${4001}`));
