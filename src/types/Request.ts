import { Request } from "express";
import { z } from "zod";
import { GenericAPISchema } from "@carded-id/api-server-schema";

export interface TypedRequest<
  TSchema extends z.infer<typeof GenericAPISchema> | undefined = undefined
> extends Request {
  params: TSchema extends z.infer<typeof GenericAPISchema>
    ? TSchema["params"]
    : any;
  body: TSchema extends z.infer<typeof GenericAPISchema>
    ? TSchema["params"]
    : any;
  query: TSchema extends z.infer<typeof GenericAPISchema>
    ? TSchema["params"]
    : any;
  userId?: string;
}
