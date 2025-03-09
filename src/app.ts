import express, { Request, Response } from "express";
import cors from "cors";
import userRoute from "./routes/handlers/users.api";
import router from "./routes/router";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router("/user", userRoute()));
export default app;
