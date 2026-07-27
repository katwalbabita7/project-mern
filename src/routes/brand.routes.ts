import express from "express";

import {
    createBrand,
    getAllBrands,
    getBrand,
    updateBrand,
    deleteBrand
} from "../controllers/brand.controller";

import { uploder } from "../middlewares/multer.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { Role } from "../@types/enum.types";

// Import Validators
import {
    validateCreateBrand,
    validateGetAllBrands,
    validateGetBrand,
    validateUpdateBrand,
    validateDeleteBrand,
} from "../validators/brand.validator";

const router = express.Router();
const upload = uploder();

// ROUTES

// Create Brand
router.post(
    "/",
    authenticate([Role.ADMIN, Role.SUPER_ADMIN]),
    upload.single("logo"),
    validateCreateBrand,           // ← Validation
    createBrand
);

// Get All Brands
router.get(
    "/",
    validateGetAllBrands,          // ← Validation
    getAllBrands
);

// Get Single Brand
router.get(
    "/:id",
    validateGetBrand,              // ← Validation
    getBrand
);

// Update Brand
router.put(
    "/:id",
    authenticate([Role.ADMIN, Role.SUPER_ADMIN]),
    upload.single("logo"),
    validateUpdateBrand,           // ← Validation
    updateBrand
);

// Delete Brand
router.delete(
    "/:id",
    authenticate([Role.ADMIN, Role.SUPER_ADMIN]),
    validateDeleteBrand,           // ← Validation
    deleteBrand
);

export default router;