import * as express from "express";
import { authorizeRoute } from "../../middleware/authorizeRoute";
import authController from "./auth.controller";
const router = express.Router();

router.post("/sign_in", authController.signIn);
router.post("/sign_up", authController.signUp);
router.post("/sign_out", authorizeRoute, authController.signOut);
router.post("/refresh_tokens", authController.refreshTokens);
router.post("/global_sign_out", authorizeRoute, authController.globalSignOut);

export default router;
