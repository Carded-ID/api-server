import e, { Request, Response } from "express";
import {
  UserAPISignInSchema,
  UserAPISignUpSchema,
} from "@carded-id/api-server-schema";
import { AppDataSource } from "../../config/db.config";
import { User } from "../../models/User.model";
import { comparePassword, hashPassword } from "../../utils/auth.util";
import { validate } from "../../utils/validate.util";

const userRepository = AppDataSource.getRepository(User);

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
    try {
      await userRepository.save({ email, password: encryptedPassword });
    } catch (err) {
      console.error(err);
      // TODO: Error handling
      return res.status(500).send("An error occured");
    }
    return res.status(200).send("User created");
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

    return res.status(200).send({ email: user.email });
  },
};

export default controller;
