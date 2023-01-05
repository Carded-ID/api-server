import * as express from "express";
import profileController from "./profile.controller";
const router = express.Router();

router.post("/", profileController.createProfile);
router.get("/:username", profileController.getProfile);
router.put("/:username", profileController.updateProfile);
router.delete("/:username", profileController.deleteProfile);

export default router;
