import * as dotenv from "dotenv";
dotenv.config();

export const PORT = parseInt(process.env.PORT || "5000");

export const PG_CONFIG = {
  PG_HOST: process.env.PG_HOST,
  PG_PORT: parseInt(process.env.PG_PORT || "5432"),
  PG_USERNAME: process.env.PG_USERNAME,
  PG_PASSWORD: process.env.PG_PASSWORD,
  PG_DATABASE: process.env.PG_DATABASE,
};
