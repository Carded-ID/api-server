import {
  ProfileAPICreateProfileSchema,
  ProfileAPIGetProfileSchema,
  ProfileAPIUpdateProfileSchema,
} from "@carded-id/api-server-schema";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/db.config";
import {
  ResponseError,
  ResponseErrorTypes,
} from "../../middleware/errorHandler";
import { Profile } from "../../models/Profile.model";
import { validate } from "../../utils/validate";

const profileRepository = AppDataSource.getRepository(Profile);

// TODO: Input validation Error

const controller = {
  async createProfile(req: Request, res: Response) {
    const { parsed, error } = await validate(
      ProfileAPICreateProfileSchema,
      req
    );
    if (error) {
      console.log("Validation Error", error);
      throw new ResponseError(ResponseErrorTypes.validationError);
    }

    const existingProfile = await profileRepository.findBy({
      username: parsed.body.username,
    });
    if (existingProfile.length !== 0) {
      throw new ResponseError(ResponseErrorTypes.profileAlreadyExists);
    }

    await profileRepository.save(parsed.body);

    return res.status(201).send();
  },
  async getProfile(req: Request, res: Response) {
    const { parsed, error } = await validate(ProfileAPIGetProfileSchema, req);
    if (error) {
      console.log("Validation Error", error);
      throw new ResponseError(ResponseErrorTypes.validationError);
    }

    const profile = await profileRepository.findOneBy({
      username: parsed.params.username,
    });
    if (!profile) {
      throw new ResponseError(ResponseErrorTypes.profileNotFound);
    }

    return res.status(200).send(profile);
  },
  async updateProfile(req: Request, res: Response) {
    const { parsed, error } = await validate(
      ProfileAPIUpdateProfileSchema,
      req
    );
    if (error) {
      console.log("Validation Error", error);
      throw new ResponseError(ResponseErrorTypes.validationError);
    }

    const username = parsed.params.username;
    const profile = parsed.body;

    const newProfile = await profileRepository.update({ username }, profile);
    return res.status(201).send(newProfile);
  },
  async deleteProfile(req: Request, res: Response) {
    const username = req.params.username;
    await profileRepository.delete({ username });
    res.status(204).send();
  },
};

export default controller;
