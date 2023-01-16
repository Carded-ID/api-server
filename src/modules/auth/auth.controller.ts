import { CookieOptions, Request, Response } from "express";
import {
  UserAPISignInSchema,
  UserAPISignUpSchema,
} from "@carded-id/api-server-schema";
import { AppDataSource } from "../../config/db.config";
import { User } from "../../models/User.model";
import {
  comparePassword,
  generateTokens,
  hashPassword,
  verifyRefreshToken,
} from "../../utils/authUtils";
import { validate } from "../../utils/validate";
import { NODE_ENV } from "../../config/env.config";
import { TypedRequest } from "../../types/Request";
import {
  ResponseError,
  ResponseErrorTypes,
} from "../../middleware/errorHandler";

const userRepository = AppDataSource.getRepository(User);

const refreshTokenCookieOptions: CookieOptions = {
  maxAge: 2 * 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: true,
  path: "/auth/refresh_tokens",
  secure: NODE_ENV !== "development",
};

const controller = {
  async signUp(req: Request, res: Response) {
    const { parsed, error } = await validate(UserAPISignUpSchema, req);
    if (error) {
      // TODO: Validation Error Handling
      console.log("Validation error", error);
      throw new ResponseError(ResponseErrorTypes.validationError);
    }
    const { email, password } = parsed.body;

    const encryptedPassword = await hashPassword(password);

    // check email does not exist
    const existingUser = await userRepository.findBy({ email });
    if (existingUser.length !== 0) {
      throw new ResponseError(ResponseErrorTypes.emailAlreadyExists);
    }

    // save user into db
    const user = await userRepository.save({
      email,
      password: encryptedPassword,
    });

    const { accessToken, refreshToken } = generateTokens(
      { id: user.id },
      user.refreshTokenGeneration
    );
    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
    return res.status(200).send({ accessToken });
  },

  async signIn(req: Request, res: Response) {
    const { parsed, error } = await validate(UserAPISignInSchema, req);
    if (error) {
      // TODO: Validation Error Handling
      console.log("Validation error", error);
      throw new ResponseError(ResponseErrorTypes.invalidEmailOrPassword);
    }
    const { email, password } = parsed.body;

    const user = await userRepository.findOneBy({ email });
    if (!user || !(await comparePassword(password, user.password))) {
      throw new ResponseError(ResponseErrorTypes.invalidCredentials);
    }

    const { accessToken, refreshToken } = generateTokens(
      { id: user.id },
      user.refreshTokenGeneration
    );
    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
    return res.status(200).send({ accessToken });
  },

  async signOut(req: TypedRequest, res: Response) {
    if (!req.userId) {
      // should not hit this code
      throw new ResponseError(ResponseErrorTypes.genericAuthError);
    }
    res.cookie("refresh_token", "", refreshTokenCookieOptions);
    res.status(200).send("Signed out");
  },

  async refreshTokens(req: Request, res: Response) {
    const refreshToken: string = req.cookies["refresh_token"];
    if (!refreshToken) {
      throw new ResponseError(ResponseErrorTypes.invalidRefreshToken);
    }

    const { payload } = verifyRefreshToken(refreshToken);
    if (
      !payload ||
      payload.id === undefined ||
      payload.generation === undefined
    ) {
      throw new ResponseError(ResponseErrorTypes.invalidRefreshToken);
    }

    const user = await userRepository.findOneBy({ id: payload.id });
    if (!user || user.refreshTokenGeneration !== payload.generation) {
      throw new ResponseError(ResponseErrorTypes.invalidRefreshToken);
    }

    const tokens = generateTokens({ id: user.id }, user.refreshTokenGeneration);
    res.cookie("refresh_token", tokens.refreshToken, refreshTokenCookieOptions);
    return res.status(200).send({ accessToken: tokens.accessToken });
  },

  async globalSignOut(req: TypedRequest, res: Response) {
    if (!req.userId) {
      // should not hit this code
      throw new ResponseError(ResponseErrorTypes.genericAuthError);
    }

    const user = await userRepository.findOneBy({ id: req.userId });
    if (!user) {
      throw new ResponseError(ResponseErrorTypes.unauthorized);
    }

    await userRepository.increment(
      { id: req.userId },
      "refreshTokenGeneration",
      1
    );
    res.cookie("refresh_token", "", refreshTokenCookieOptions);
    res.status(200).send("Signed out");
  },
};

export default controller;
