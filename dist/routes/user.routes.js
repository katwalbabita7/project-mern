"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../@types/enum.types");
const router = express_1.default.Router();
router.use((0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]));
router.get("/", user_controller_1.getAllUsers);
router.get("/:id", user_controller_1.getUserById);
router.put("/:id", user_controller_1.updateUser);
router.delete("/:id", user_controller_1.deleteUser);
exports.default = router;
