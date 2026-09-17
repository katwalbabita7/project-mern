import express from "express";

import {
    getAllCategories,
    createCategories,
    getCategories,
    updateCategories,
    deleteCategories,
} from "../controllers/category.controller";

import { uploder } from "../middlewares/multer.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { Role } from "../@types/enum.types";

// Import Validators
import {
    validateCreateCategory,
    validateGetAllCategories,
    validateGetCategory,
    validateUpdateCategory,
    validateDeleteCategory,
} from "../validators/category.validator";

const router = express.Router();
const upload = uploder();

// CATEGORY ROUTES 

// Create Category
router.post(
    "/",
    authenticate([Role.ADMIN, Role.SUPER_ADMIN]),
    upload.single("image"),           // field name "image"
    validateCreateCategory,
    createCategories
);

// Get All Categories
router.get(
    "/",
    validateGetAllCategories,
    getAllCategories
);

// Get Single Category
router.get(
    "/:id",
    validateGetCategory,
    getCategories
);

// Update Category
router.put(
    "/:id",
    authenticate([Role.ADMIN, Role.SUPER_ADMIN]),
    upload.single("image"),
    validateUpdateCategory,
    updateCategories
);

// Delete Category
router.delete(
    "/:id",
    authenticate([Role.ADMIN, Role.SUPER_ADMIN]),
    validateDeleteCategory,
    deleteCategories
);

export default router;