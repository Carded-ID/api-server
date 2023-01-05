import { Request, Response } from "express";
import { AppDataSource } from "../../config/db.config";
import { Profile } from "../../models/Profile.model";

export const profileRepository = AppDataSource.getRepository(Profile);

// TODO: Input validation
// TODO: Error handling

const controller = {
  async createProfile(req: Request, res: Response) {
    // TODO: Input validation and formatting
    const profile = req.body;
    console.log(profile);
    await profileRepository.save(profile).catch((err) => {
      console.error(err);
      // TODO: Error handling
      res.status(500).send("DB error");
    });
    res.status(201).send();
  },
  async getProfile(req: Request, res: Response) {
    // TODO: Input validation
    const username = req.params.username;
    const profile = await profileRepository.findOneBy({ username });

    if (!profile) {
      return res.status(404).send("Profile not found");
    }
    return res.status(200).send(profile);
  },
  async updateProfile(req: Request, res: Response) {
    // TODO: Input validation
    const username = req.params.username;
    const profile = req.body;
    await profileRepository.update({ username }, profile).catch((err) => {
      console.error(err);
      // TODO: Error handling
      res.status(500).send("DB error");
    });
    res.status(201).send();
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
