import express, { Router } from "express";

import {
  register,
  login,
  logout,
  getProfile,
  deleteAccount,
  changePassword,
  changeEmail,
} from "../controllers/auth.controller";
import { uploder } from "../middlewares/multer.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validator.middleware";
import { registerUserSchema } from "../validators/auth.validator";

const router = express.Router();
const upload = uploder();

// register
router.post("/register", upload.single("profile_image"), register);

// * login
router.post("/login", login);

// * logout
router.post("/logout", logout);

// Protected routes (only logged in user access )
router.get("/profile", authenticate(), getProfile);
router.delete("/account", authenticate(), deleteAccount);
router.patch("/change-password", authenticate(), changePassword);
router.patch("/change-email", authenticate(), changeEmail);

export default router;

