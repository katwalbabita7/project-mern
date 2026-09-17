"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../@types/enum.types");
// Import Validators
const category_validator_1 = require("../validators/category.validator");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.uploder)();
// CATEGORY ROUTES 
// Create Category
router.post("/", (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), upload.single("image"), // field name "image"
category_validator_1.validateCreateCategory, category_controller_1.createCategories);
// Get All Categories
router.get("/", category_validator_1.validateGetAllCategories, category_controller_1.getAllCategories);
// Get Single Category
router.get("/:id", category_validator_1.validateGetCategory, category_controller_1.getCategories);
// Update Category
router.put("/:id", (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), upload.single("image"), category_validator_1.validateUpdateCategory, category_controller_1.updateCategories);
// Delete Category
router.delete("/:id", (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), category_validator_1.validateDeleteCategory, category_controller_1.deleteCategories);
exports.default = router;
