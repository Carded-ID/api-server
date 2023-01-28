import {
  ProfileAPIDeleteProfileSchema,
  ProfileAPIGetProfileSchema,
  ProfileAPIUpdateProfileSchema,
} from "@carded-id/api-server-schema";
import * as express from "express";
import { authorizeRoute } from "../../middleware/authorizeRoute";
import { validateEndpoint } from "../../middleware/validateEndpoint";
import { wrap } from "../../utils/asyncWrapper";
import profileController from "./profile.controller";

const router = express.Router();

router.post("/", authorizeRoute, wrap(profileController.createProfile));
router.get(
  "/:username",
  wrap(
    validateEndpoint(ProfileAPIGetProfileSchema, profileController.getProfile)
  )
);
router.put(
  "/:username",
  authorizeRoute,
  wrap(
    validateEndpoint(
      ProfileAPIUpdateProfileSchema,
      profileController.updateProfile
    )
  )
);
router.delete(
  "/:username",
  authorizeRoute,
  wrap(
    validateEndpoint(
      ProfileAPIDeleteProfileSchema,
      profileController.deleteProfile
    )
  )
);

export default router;
