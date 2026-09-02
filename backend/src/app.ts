import express from "express";
import cors from "cors";

import { appRouter } from "./routes/routes";
import { env } from "./config/env";

const app = express();

const allowedOrigins = ["http://localhost:5173", env.FRONTEND_URL].filter(
  Boolean,
);

console.log("Allowed CORS origins:", allowedOrigins);

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, success?: boolean) => void,
  ) => {
    console.log("Incoming origin:", origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Rejected CORS origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", appRouter);

export default app;
