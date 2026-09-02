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
    origin: (origin, callback) => {
      console.log("Incoming CORS origin:", origin);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("CORS rejected origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api", appRouter);

export default app;
