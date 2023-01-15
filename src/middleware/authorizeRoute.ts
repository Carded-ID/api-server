import { NextFunction, Request, Response } from "express";
import {} from "@carded-id/api-server-schema";
import { TypedRequest } from "../types/Request";
import { verifyAccessToken } from "../utils/authUtils";

export const authorizeRoute = (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Authorization header not found");
  }
  const { payload, err } = verifyAccessToken(token);
  if (!payload || !payload.id) {
    // TODO: Error handling
    return res.status(403).send(err);
  }
  req.userId = payload.id;
  return next();
};
