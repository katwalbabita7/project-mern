"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.uploder)();
// register
router.post("/register", upload.single("profile_image"), auth_controller_1.register);
// * login
router.post("/login", auth_controller_1.login);
// * logout
router.post("/logout", auth_controller_1.logout);
// Protected routes (only logged in user access )
router.get("/profile", (0, auth_middleware_1.authenticate)(), auth_controller_1.getProfile);
router.delete("/account", (0, auth_middleware_1.authenticate)(), auth_controller_1.deleteAccount);
router.patch("/change-password", (0, auth_middleware_1.authenticate)(), auth_controller_1.changePassword);
router.patch("/change-email", (0, auth_middleware_1.authenticate)(), auth_controller_1.changeEmail);
exports.default = router;
