import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./Auth/routes/auth.routes.js";
import feedbackRoutes from "./models/feedback/routes.js";
import profileRoutes from "./models/user/routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.get("/", (_req: Request, res: Response) => {
    res.send("APP RUNNING");
});

app.use("/auth", authRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/profile", profileRoutes);

app.listen(3000, () => {
    console.log("App is running on port 3000");
});