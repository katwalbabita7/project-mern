import express, { Router } from "express";

import {
  register,
  login,getProfile,deleteAccount
} from "../controllers/auth.controller";
import { uploder } from "../middlewares/multer.middleware";
import {authenticate} from "../middlewares/auth.middleware";

const router = express.Router();
const upload = uploder();

// register
router.post("/register",upload.single("profile_image"), register);

// * login
router.post("/login", login);

// Protected routes (only logged in user access )
router.get("/profile", authenticate(), getProfile);
router.delete("/account", authenticate(), deleteAccount);

export default router;

