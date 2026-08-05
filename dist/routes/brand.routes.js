"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const brand_controller_1 = require("../controllers/brand.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../@types/enum.types");
// Import Validators
const brand_validator_1 = require("../validators/brand.validator");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.uploder)();
// ROUTES
// Create Brand
router.post("/", (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), upload.single("logo"), brand_validator_1.validateCreateBrand, // ← Validation
brand_controller_1.createBrand);
// Get All Brands
router.get("/", brand_validator_1.validateGetAllBrands, // ← Validation
brand_controller_1.getAllBrands);
// Get Single Brand
router.get("/:id", brand_validator_1.validateGetBrand, // ← Validation
brand_controller_1.getBrand);
// Update Brand
router.put("/:id", (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), upload.single("logo"), brand_validator_1.validateUpdateBrand, // ← Validation
brand_controller_1.updateBrand);
// Delete Brand
router.delete("/:id", (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), brand_validator_1.validateDeleteBrand, // ← Validation
brand_controller_1.deleteBrand);
exports.default = router;
