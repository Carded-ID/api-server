import {
  ProfileAPICreateProfileSchema,
  ProfileAPIDeleteProfileSchema,
  ProfileAPIGetProfileSchema,
  ProfileAPIUpdateProfileSchema,
} from "@carded-id/api-server-schema";
import { AppDataSource } from "../../config/db.config";
import {
  ResponseError,
  ResponseErrorTypes,
} from "../../middleware/errorHandler";
import { TypedController } from "../../middleware/validateEndpoint";
import { Profile } from "../../models/Profile.model";

const profileRepository = AppDataSource.getRepository(Profile);

interface Controller {
  createProfile: TypedController<typeof ProfileAPICreateProfileSchema>;
  getProfile: TypedController<typeof ProfileAPIGetProfileSchema>;
  updateProfile: TypedController<typeof ProfileAPIUpdateProfileSchema>;
  deleteProfile: TypedController<typeof ProfileAPIDeleteProfileSchema>;
}

const controller: Controller = {
  async createProfile(req, res) {
    const existingProfile = await profileRepository.findBy({
      username: req.body.username,
    });
    if (existingProfile.length !== 0) {
      throw new ResponseError(ResponseErrorTypes.profileAlreadyExists);
    }

    await profileRepository.save(req.body);

    return res.status(201).send();
  },
  async getProfile(req, res) {
    const profile = await profileRepository.findOneBy({
      username: req.params.username,
    });
    if (!profile) {
      throw new ResponseError(ResponseErrorTypes.profileNotFound);
    }

    return res.status(200).send(profile);
  },
  async updateProfile(req, res) {
    const username = req.params.username;
    const profile = req.body;

    const newProfile = await profileRepository.update({ username }, profile);
    return res.status(201).send(newProfile);
  },
  async deleteProfile(req, res) {
    const username = req.params.username;
    await profileRepository.delete({ username });
    res.status(204).send();
  },
};

export default controller;
