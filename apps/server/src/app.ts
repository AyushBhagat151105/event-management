import express, { Express } from "express";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route";
import eventrouter from "./routes/event.route";
const app: Express = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser());
app.get("/", (req, res) => {
  res.status(200).json("It is up and running...");
});
app.use("/api/auth", authRoute);
app.use("/api/events", eventrouter);
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);

export default app;
