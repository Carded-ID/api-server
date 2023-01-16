import * as express from "express";
import { authorizeRoute } from "../../middleware/authorizeRoute";
import { wrap } from "../../utils/asyncWrapper";
import profileController from "./profile.controller";

const router = express.Router();

router.post("/", authorizeRoute, wrap(profileController.createProfile));
router.get("/:username", wrap(profileController.getProfile));
router.put("/:username", authorizeRoute, wrap(profileController.updateProfile));
router.delete(
  "/:username",
  authorizeRoute,
  wrap(profileController.deleteProfile)
);

export default router;
