import {
  UserAPISignInSchema,
  UserAPISignUpSchema,
} from "@carded-id/api-server-schema";
import * as express from "express";
import { authorizeRoute } from "../../middleware/authorizeRoute";
import { validateEndpoint } from "../../middleware/validateEndpoint";
import { wrap } from "../../utils/asyncWrapper";
import authController from "./auth.controller";

const router = express.Router();

router.post(
  "/sign_in",
  wrap(validateEndpoint(UserAPISignInSchema, authController.signIn))
);
router.post(
  "/sign_up",
  wrap(validateEndpoint(UserAPISignUpSchema, authController.signUp))
);
router.post("/sign_out", authorizeRoute, wrap(authController.signOut));
router.post("/refresh_tokens", wrap(authController.refreshTokens));
router.post(
  "/global_sign_out",
  authorizeRoute,
  wrap(authController.globalSignOut)
);

export default router;
