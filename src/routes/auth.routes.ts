import express, { Router } from "express";

import {
  register,
  login
} from "../controllers/auth.controller";
import { uploder } from "../middlewares/multer.middleware";

const router = express.Router();
const upload = uploder();

// register
router.post("/register",upload.single("profile_image"), register);

// * login
router.post("/login", login);

export default router;

