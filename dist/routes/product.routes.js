"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../@types/enum.types");
// Import Product Validators
const product_validator_1 = require("../validators/product.validator");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.uploder)();
// PUBLIC ROUTES 
// Get all products with filtering & pagination
router.get('/', product_validator_1.validateGetAllProducts, product_controller_1.getAllProducts);
// Get featured products
router.get('/featured', product_controller_1.getFeaturedProducts);
// Get new arrivals
router.get('/new-arrivals', product_controller_1.getNewArrivals);
// Get products by brand
router.get('/brand/:brand', product_validator_1.validateGetProductsByBrand, product_controller_1.getProductsByBrand);
// Get single product by ID
router.get('/:id', product_validator_1.validateProductId, product_controller_1.getProductById);
//*ADMIN ROUTES 
// Create Product
router.post('/', (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), upload.array('images', 5), product_validator_1.validateCreateProduct, // ← Validation
product_controller_1.createProduct);
// Update Product
router.put('/:id', (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), upload.array('images', 5), product_validator_1.validateProductId, // ← ID validation first
product_validator_1.validateUpdateProduct, // ← Update validation
product_controller_1.updateProduct);
// Delete Product
router.delete('/:id', (0, auth_middleware_1.authenticate)([enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]), product_validator_1.validateProductId, // ← ID validation
product_controller_1.deleteProduct);
exports.default = router;
