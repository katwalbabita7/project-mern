"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuth_controller_1 = require("../controllers/adminAuth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../@types/enum.types");
const adminLogin_validator_1 = require("../validators/adminLogin.validator");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const router = express_1.default.Router();
// Login
router.post("/login", (0, validator_middleware_1.validate)(adminLogin_validator_1.adminLoginSchema), adminAuth_controller_1.adminLogin);
// Logout - Protected
router.post("/logout", (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN]), adminAuth_controller_1.adminLogout);
// Optional: Admin profile
// router.get("/me", authenticate([Role.ADMIN]), getAdminProfile);
exports.default = router;
