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

const userRepository = AppDataSource.getRepository(User);

const refreshTokenCookieOptions: CookieOptions = {
  maxAge: 2 * 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: true,
  path: "/auth/refresh_tokens",
  secure: NODE_ENV !== "development",
};
// TODO: Error handling

const controller = {
  async signUp(req: Request, res: Response) {
    const { parsed, error } = await validate(UserAPISignUpSchema, req);
    if (error) {
      return res.status(400).send("Invalid email or password");
    }
    const { email, password } = parsed.body;

    const encryptedPassword = await hashPassword(password);

    // check email does not exist
    try {
      const existingUser = await userRepository.findBy({ email });
      if (existingUser.length !== 0) {
        return res.status(400).send("Email already exists");
      }
    } catch (err) {
      return res.status(500).send("An error occured");
    }

    // save user into db
    let user: User;
    try {
      user = await userRepository.save({ email, password: encryptedPassword });
    } catch (err) {
      console.error(err);
      // TODO: Error handling
      return res.status(500).send("An error occured");
    }

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
      return res.status(400).send("Invalid email or password");
    }
    const { email, password } = parsed.body;

    let user: User | null;
    try {
      user = await userRepository.findOneBy({ email });
    } catch (err) {
      console.error(err);
      // TODO: Error handling
      return res.status(500).send("An error occured");
    }

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).send("Invalid Credentials");
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
      return res.status(401).send("User not found");
    }
    res.cookie("refresh_token", "", refreshTokenCookieOptions);
    res.status(200).send("Signed out");
  },

  async refreshTokens(req: Request, res: Response) {
    const refreshToken: string = req.cookies["refresh_token"];
    if (!refreshToken) {
      return res.status(401).send("Invalid Refresh Token");
    }

    const { payload } = verifyRefreshToken(refreshToken);
    if (
      !payload ||
      payload.id === undefined ||
      payload.generation === undefined
    ) {
      return res.status(401).send("Invalid Refresh Token");
    }

    const user = await userRepository.findOneBy({ id: payload.id });
    if (!user || user.refreshTokenGeneration !== payload.generation) {
      return res.status(401).send("Invalid Refresh Token");
    }

    const tokens = generateTokens({ id: user.id }, user.refreshTokenGeneration);
    res.cookie("refresh_token", tokens.refreshToken, refreshTokenCookieOptions);
    return res.status(200).send({ accessToken: tokens.accessToken });
  },

  async globalSignOut(req: TypedRequest, res: Response) {
    if (!req.userId) {
      return res.status(401).send("user not found");
    }

    const user = await userRepository.findOneBy({ id: req.userId });
    if (!user) {
      return res.status(401).send("User not found");
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
