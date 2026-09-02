import express from "express";
import cors from "cors";

import { appRouter } from "./routes/routes";
import { env } from "./config/env";

const app = express();

const allowedOrigins = ["http://localhost:5173", env.FRONTEND_URL].filter(
  Boolean,
);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api", appRouter);

export default app;
