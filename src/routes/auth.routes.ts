import express, { Router } from "express";

import {
  register
} from "../controllers/auth.controller";
import { uploder } from "../middlewares/multer.middleware";

const router = express.Router();
const upload = uploder();

// Authentication
router.post("/register",upload.single("profile_image"), register);

export default router;

