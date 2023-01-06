import * as express from "express";
import authController from "./auth.controller";
const router = express.Router();

router.post("/signin", authController.signIn);
router.post("/signup", authController.signUp);

export default router;
