import "reflect-metadata";
import Express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { PORT } from "./config/env.config";
import { AppDataSource } from "./config/db.config";
import profileRouter from "./modules/profile/profile.routes";
import authRouter from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/errorHandler";

AppDataSource.initialize().then(() => console.log("Database Initialized"));

const app = Express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/profile", profileRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API Server listening on port ${PORT}`);
});
