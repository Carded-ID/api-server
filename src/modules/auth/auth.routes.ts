import * as express from "express";
import { authorizeRoute } from "../../middleware/authorizeRoute";
import { wrap } from "../../utils/asyncWrapper";
import authController from "./auth.controller";

const router = express.Router();

router.post("/sign_in", wrap(authController.signIn));
router.post("/sign_up", wrap(authController.signUp));
router.post("/sign_out", authorizeRoute, wrap(authController.signOut));
router.post("/refresh_tokens", wrap(authController.refreshTokens));
router.post(
  "/global_sign_out",
  authorizeRoute,
  wrap(authController.globalSignOut)
);

export default router;
