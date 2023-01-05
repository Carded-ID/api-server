import Express from "express";
import "reflect-metadata";

import { PORT } from "./config/env.config";
import { AppDataSource } from "./config/db.config";
import profileRouter from "./modules/profile/profile.routes";
import bodyParser from "body-parser";

AppDataSource.initialize().then(() => console.log("Database Initialized"));

const app = Express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/profile", profileRouter);

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`API Server listening on port ${PORT}`);
});
