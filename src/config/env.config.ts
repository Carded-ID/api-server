import * as dotenv from "dotenv";
dotenv.config();

class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export const NODE_ENV = process.env.NODE_ENV;

export const PORT = parseInt(process.env.PORT || "5000");

export const PG_CONFIG = {
  PG_HOST: process.env.PG_HOST,
  PG_PORT: parseInt(process.env.PG_PORT || "5432"),
  PG_USERNAME: process.env.PG_USERNAME,
  PG_PASSWORD: process.env.PG_PASSWORD,
  PG_DATABASE: process.env.PG_DATABASE,
};

if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
  throw new ConfigError("JWT access token secret not found");
}
if (!process.env.JWT_REFRESH_TOKEN_SECRET) {
  throw new ConfigError("JWT refresh token secret not found");
}

export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
