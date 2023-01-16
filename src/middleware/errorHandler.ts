import { NextFunction, Request, response, Response } from "express";
import { QueryFailedError } from "typeorm";

export enum ResponseErrorTypes {
  // general
  unexpectedError = 100,
  dbError,
  validationError,

  // auth
  genericAuthError = 200,
  unauthorized,
  headerNotFound,
  userNotFound,
  invalidRefreshToken,
  invalidEmailOrPassword,
  invalidEmail,
  emailAlreadyExists,
  invalidCredentials,

  // Profile
  profileNotFound = 300,
  profileAlreadyExists,
}

type ResponseErrorDetails = {
  code: ResponseErrorTypes;
  httpStatus: number;
  defaultMessage: string;
};

const responseErrorDetails: Record<ResponseErrorTypes, ResponseErrorDetails> = {
  // General
  [ResponseErrorTypes.unexpectedError]: {
    code: ResponseErrorTypes.unexpectedError,
    defaultMessage: "An unexpected error occured",
    httpStatus: 500,
  },
  [ResponseErrorTypes.dbError]: {
    code: ResponseErrorTypes.dbError,
    defaultMessage: "An error occured",
    httpStatus: 500,
  },
  [ResponseErrorTypes.validationError]: {
    code: ResponseErrorTypes.validationError,
    defaultMessage: "Invalid input",
    httpStatus: 400,
  },

  // Auth
  [ResponseErrorTypes.genericAuthError]: {
    code: ResponseErrorTypes.genericAuthError,
    defaultMessage: "Authorization Error",
    httpStatus: 401,
  },
  [ResponseErrorTypes.unauthorized]: {
    code: ResponseErrorTypes.unauthorized,
    defaultMessage: "Unauthorized",
    httpStatus: 403,
  },
  [ResponseErrorTypes.headerNotFound]: {
    code: ResponseErrorTypes.headerNotFound,
    defaultMessage: "Authorization header not found",
    httpStatus: 401,
  },
  [ResponseErrorTypes.userNotFound]: {
    code: ResponseErrorTypes.userNotFound,
    defaultMessage: "User not found",
    httpStatus: 401,
  },
  [ResponseErrorTypes.invalidRefreshToken]: {
    code: ResponseErrorTypes.invalidRefreshToken,
    defaultMessage: "Invalid refresh token",
    httpStatus: 401,
  },
  [ResponseErrorTypes.invalidEmailOrPassword]: {
    code: ResponseErrorTypes.invalidEmailOrPassword,
    defaultMessage: "Invalid email or password",
    httpStatus: 400,
  },
  [ResponseErrorTypes.invalidEmail]: {
    code: ResponseErrorTypes.invalidEmail,
    defaultMessage: "Invalid email",
    httpStatus: 400,
  },
  [ResponseErrorTypes.emailAlreadyExists]: {
    code: ResponseErrorTypes.emailAlreadyExists,
    defaultMessage: "Email alreay exists",
    httpStatus: 400,
  },
  [ResponseErrorTypes.invalidCredentials]: {
    code: ResponseErrorTypes.invalidCredentials,
    defaultMessage: "Invalid credentials",
    httpStatus: 400,
  },

  // Profile
  [ResponseErrorTypes.profileNotFound]: {
    code: ResponseErrorTypes.profileNotFound,
    defaultMessage: "Profile not found",
    httpStatus: 404,
  },
  [ResponseErrorTypes.profileAlreadyExists]: {
    code: ResponseErrorTypes.profileAlreadyExists,
    defaultMessage: "Username taken",
    httpStatus: 404,
  },
};

type ErrorBody = {
  message: string;
  field?: string;
};

export class ResponseError extends Error {
  httpStatus: number;
  errorCode: ResponseErrorTypes;
  errorBody?: ErrorBody;

  constructor(
    errorCode: ResponseErrorTypes,
    errorBody?: Partial<ErrorBody>,
    ...params: any
  ) {
    super();
    this.name = "ResponseError";
    this.errorCode = errorCode;
    this.httpStatus = responseErrorDetails[errorCode].httpStatus;
    this.errorBody = {
      message: responseErrorDetails[errorCode].defaultMessage,
      ...errorBody,
    };
    Object.setPrototypeOf(this, ResponseError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let responseError: ResponseError;
  if (err instanceof ResponseError) {
    responseError = err as ResponseError;
  } else if (err instanceof QueryFailedError) {
    console.log(err);
    responseError = new ResponseError(ResponseErrorTypes.dbError);
  } else {
    console.log(err);
    responseError = new ResponseError(ResponseErrorTypes.unexpectedError);
  }
  return res.status(responseError.httpStatus).send({
    success: false,
    error: {
      errorCode: responseError.errorCode,
      body: responseError.errorBody,
      stack: responseError.stack,
    },
  });
};
