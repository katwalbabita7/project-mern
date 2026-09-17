import express from "express";
import { adminLogin, adminLogout } from "../controllers/adminAuth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { Role } from "../@types/enum.types";
import { adminLoginSchema } from "../validators/adminLogin.validator";
import { validate } from "../middlewares/validator.middleware";

const router = express.Router();

// Login
router.post("/login", validate(adminLoginSchema), adminLogin);

// Logout - Protected
router.post("/logout", authenticate([Role.ADMIN]), adminLogout);

// Optional: Admin profile
// router.get("/me", authenticate([Role.ADMIN]), getAdminProfile);

export default router;