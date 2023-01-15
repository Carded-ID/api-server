import {
  ProfileAPICreateProfileSchema,
  ProfileAPIGetProfileSchema,
  ProfileAPIUpdateProfileSchema,
} from "@carded-id/api-server-schema";
import { z } from "zod";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/db.config";
import { Profile } from "../../models/Profile.model";
import { validate } from "../../utils/validate";
import { UpdateResult } from "typeorm";

const profileRepository = AppDataSource.getRepository(Profile);

// TODO: Input validation
// TODO: Error handling

const controller = {
  async createProfile(req: Request, res: Response) {
    const { parsed, error } = await validate(
      ProfileAPICreateProfileSchema,
      req
    );
    if (error) {
      return res.send(400).send(error);
    }

    try {
      await profileRepository.save(parsed.body);
    } catch (err) {
      console.error(err);
      // TODO: Error handling
      return res.status(500).send("An error occured");
    }

    return res.status(201).send();
  },
  async getProfile(req: Request, res: Response) {
    const { parsed, error } = await validate(ProfileAPIGetProfileSchema, req);
    if (error) {
      return res.send(400).send(error);
    }

    const profile = await profileRepository.findOneBy({
      username: parsed.params.username,
    });
    if (!profile) {
      return res.status(404).send("Profile not found");
    }

    return res.status(200).send(profile);
  },
  async updateProfile(req: Request, res: Response) {
    const { parsed, error } = await validate(
      ProfileAPIUpdateProfileSchema,
      req
    );
    if (error) {
      return res.send(400).send(error);
    }

    const username = parsed.params.username;
    const profile = parsed.body;

    let newProfile: UpdateResult;
    try {
      newProfile = await profileRepository.update({ username }, profile);
    } catch (err) {
      console.error(err);
      // TODO: Error handling
      return res.status(500).send("An error occured");
    }
    return res.status(201).send(newProfile);
  },
  async deleteProfile(req: Request, res: Response) {
    const username = req.params.username;
    await profileRepository.delete({ username }).catch((err) => {
      console.error(err);
      // TODO: Error handling
      res.status(500).send("DB error");
    });
    res.status(204).send();
  },
};

export default controller;
