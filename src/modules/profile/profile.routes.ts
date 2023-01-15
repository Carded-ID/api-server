import * as express from "express";
import { authorizeRoute } from "../../middleware/authorizeRoute";
import profileController from "./profile.controller";

const router = express.Router();

router.post("/", authorizeRoute, profileController.createProfile);
router.get("/:username", profileController.getProfile);
router.put("/:username", authorizeRoute, profileController.updateProfile);
router.delete("/:username", authorizeRoute, profileController.deleteProfile);

export default router;
