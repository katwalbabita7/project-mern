import express from "express";

import {
    createCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory,
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
    createCategory
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
    getCategory
);

// Update Category
router.put(
    "/:id",
    authenticate([Role.ADMIN, Role.SUPER_ADMIN]),
    upload.single("image"),
    validateUpdateCategory,
    updateCategory
);

// Delete Category
router.delete(
    "/:id",
    authenticate([Role.ADMIN, Role.SUPER_ADMIN]),
    validateDeleteCategory,
    deleteCategory
);

export default router;