import express, { Request, Response } from "express";
import cors from "cors";
import userRoute from "./routes/handlers/users";
import router from "./routes/router";
import authRoute from "./routes/handlers/auth";
import schedulesRoute from "./routes/handlers/schedules";
import casesRoute from "./routes/handlers/cases";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router("/auth", authRoute()));
app.use("/api", router("/user", userRoute()));
app.use("/api", router("/schedules", schedulesRoute()));
app.use("/api", router("/cases", casesRoute()));
export default app;
