import { NextFunction, request, Request, Response } from "express";
import { z, ZodError, TypeOf } from "zod";
import {
  GenericAPISchema,
  UserAPISignInSchema,
  UserAPISignUpSchema,
} from "@carded-id/api-server-schema";

type ValidateResult<T extends z.ZodType<TypeOf<typeof GenericAPISchema>>> =
  | {
      parsed: TypeOf<T>;
      error: undefined;
    }
  | {
      parsed: undefined;
      error: ZodError<T>;
    };
export const validate = async <
  T extends z.ZodType<TypeOf<typeof GenericAPISchema>>
>(
  schema: T,
  req: Request
): Promise<ValidateResult<T>> => {
  try {
    const parsed = await schema
      .parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      })
      .catch((err) => {
        throw err;
      });
    return { parsed: parsed, error: undefined };
  } catch (error) {
    return { parsed: undefined, error: error as ZodError };
  }
};
