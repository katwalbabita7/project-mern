import express from 'express';

import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByBrand,
    getFeaturedProducts,
    getNewArrivals
} from '../controllers/product.controller';

import { uploder } from "../middlewares/multer.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { Role } from "../@types/enum.types";

// Import Product Validators
import {
    validateCreateProduct,
    validateUpdateProduct,
    validateProductId,
    validateGetProductsByBrand,
    validateGetAllProducts,
} from '../validators/product.validator';

const router = express.Router();
const upload = uploder();

// PUBLIC ROUTES 

// Get all products with filtering & pagination
router.get('/', 
    validateGetAllProducts, 
    getAllProducts
);

// Get featured products
router.get('/featured', getFeaturedProducts);

// Get new arrivals
router.get('/new-arrivals', getNewArrivals);

// Get products by brand
router.get('/brand/:brand', 
    validateGetProductsByBrand, 
    getProductsByBrand
);

// Get single product by ID
router.get('/:id', 
    validateProductId, 
    getProductById
);

//*ADMIN ROUTES 

// Create Product
router.post(
    '/', 
    authenticate([Role.ADMIN, Role.SUPER_ADMIN]), 
    upload.array('images', 5), 
    validateCreateProduct,        // ← Validation
    createProduct
);

// Update Product
router.put(
    '/:id', 
    authenticate([Role.ADMIN, Role.SUPER_ADMIN]), 
    upload.array('images', 5), 
    validateProductId,            // ← ID validation first
    validateUpdateProduct,        // ← Update validation
    updateProduct
);

// Delete Product
router.delete(
    '/:id', 
    authenticate([Role.ADMIN, Role.SUPER_ADMIN]), 
    validateProductId,            // ← ID validation
    deleteProduct
);

export default router;