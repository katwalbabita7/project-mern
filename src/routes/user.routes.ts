import express from "express";

import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { Role } from "../@types/enum.types";

const router = express.Router();

router.use(authenticate([Role.ADMIN, Role.SUPER_ADMIN]));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;