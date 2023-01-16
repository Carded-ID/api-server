import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../types/Request";

export const wrap = (fn: (req: Request, res: Response) => any) => {
  const asyncUtilWrapreq = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const fnReturn = fn(req, res);
    return Promise.resolve(fnReturn).catch(next);
  };
  return asyncUtilWrapreq;
};
