import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { z } from "zod";
import { GenericAPISchema } from "@carded-id/api-server-schema";

export const validateEndpoint = <TReq extends typeof GenericAPISchema>(
  schema: TReq,
  callback: TypedController<TReq>
) => {
  return (req: Request, res: Response) => {
    const result = schema.safeParse(req);
    if (!result.success) {
      return res.status(400).send(result.error.issues);
    }
    callback(req as any, res);
  };
};

export interface TypedRequest<
  Params = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<Params, ResBody, ReqBody, ReqQuery, Locals> {
  userId?: string;
}

export type TypedController<
  TReq extends typeof GenericAPISchema = typeof GenericAPISchema
> = (
  req: TypedRequest<
    z.TypeOf<TReq>["params"],
    any,
    z.TypeOf<TReq>["body"],
    z.TypeOf<TReq>["query"]
  >,
  res: Response
) => Promise<any>;
