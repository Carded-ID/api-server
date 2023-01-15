import bcrypt from "bcrypt";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from "../config/env.config";

const saltRounds = 10;

export const hashPassword = async (plainTextPassword: string) => {
  const encryptedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
  return encryptedPassword;
};

export const comparePassword = async (
  plainTextPassword: string,
  encryptedPassword: string
) => {
  const match = await bcrypt.compare(plainTextPassword, encryptedPassword);
  return match;
};

export const verifyAccessToken = (token: string) => {
  let payload: string | JwtPayload;
  try {
    payload = verify(token, JWT_ACCESS_TOKEN_SECRET);
    if (typeof payload === "string") {
      throw new Error("Invalid payload");
    }
  } catch (err) {
    return { err };
  }
  return { payload };
};

export const verifyRefreshToken = (token: string) => {
  let payload: string | JwtPayload;
  try {
    payload = verify(token, JWT_REFRESH_TOKEN_SECRET);
    if (typeof payload === "string") {
      throw new Error("Invalid payload");
    }
  } catch (err) {
    return { err };
  }
  return { payload };
};

export const generateTokens = (payload: object, generation: number) => {
  const accessToken = sign(payload, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "1 day",
  });
  const refreshToken = sign(
    { ...payload, generation },
    JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "2 weeks",
    }
  );
  return { accessToken, refreshToken };
};
