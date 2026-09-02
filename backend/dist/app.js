"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes/routes");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
const allowedOrigins = ["http://localhost:5173", env_1.env.FRONTEND_URL].filter(Boolean);
console.log("Allowed CORS origins:", allowedOrigins);
const corsOptions = {
    origin: (origin, callback) => {
        console.log("Incoming origin:", origin);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.error("Rejected CORS origin:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", routes_1.appRouter);
exports.default = app;
//# sourceMappingURL=app.js.map