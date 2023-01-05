import { DataSource } from "typeorm";
import { Profile } from "../models/Profile.model";
import { PG_CONFIG } from "./env.config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: PG_CONFIG.PG_HOST,
  port: PG_CONFIG.PG_PORT,
  username: PG_CONFIG.PG_USERNAME,
  password: PG_CONFIG.PG_PASSWORD,
  database: PG_CONFIG.PG_DATABASE,
  entities: [Profile],
  synchronize: true,
  logging: false,
});
