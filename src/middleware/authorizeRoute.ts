import { NextFunction, Request, Response } from "express";
import {} from "@carded-id/api-server-schema";
import { TypedRequest } from "../types/Request";
import { verifyAccessToken } from "../utils/authUtils";
import { ResponseError, ResponseErrorTypes } from "./errorHandler";
export const authorizeRoute = (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ResponseError(ResponseErrorTypes.headerNotFound);
  }
  const { payload, err } = verifyAccessToken(token);
  if (!payload || !payload.id) {
    // TODO: Error handling
    throw new ResponseError(ResponseErrorTypes.genericAuthError);
  }
  req.userId = payload.id;
  return next();
};
