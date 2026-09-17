"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const brand_routes_1 = __importDefault(require("./routes/brand.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const wishlist_routes_1 = __importDefault(require("./routes/wishlist.routes"));
const adminAuth_routes_1 = __importDefault(require("./routes/adminAuth.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const errorhandler_middleware_1 = require("./middlewares/errorhandler.middleware");
const cors_config_1 = __importDefault(require("./config/cors.config"));
// * app instance
const app = (0, express_1.default)();
// * CORS
app.use((0, cors_1.default)(cors_config_1.default));
//* Cookie parser
app.use((0, cookie_parser_1.default)());
// * using middleware
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// *using routes
app.get("/", (req, res, next) => {
    res.status(200).json({
        message: "server is up & running",
        success: true,
        status: 'success',
        data: null,
    });
});
// * using routes
app.use("/api/v1/users", user_routes_1.default);
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/admin/auth", adminAuth_routes_1.default);
app.use("/api/v1/brands", brand_routes_1.default);
app.use("/api/v1/admin/brands", brand_routes_1.default);
app.use("/api/v1/products", product_routes_1.default);
app.use("/api/v1/admin/products", product_routes_1.default);
app.use("/api/v1/categories", category_routes_1.default);
app.use("/api/v1/admin/categories", category_routes_1.default);
app.use("/api/v1/wishlist", wishlist_routes_1.default);
app.use('/api/v1/cart', cart_routes_1.default);
app.use('/api/v1/orders', order_routes_1.default);
// * error handler route
app.use((req, res, next) => {
    const error = new Error(`Can not ${req.method} on ${req.path}`);
    error.statusCode = 404;
    error.status = "fail";
    next(error);
});
//* Global error handler
app.use(errorhandler_middleware_1.errorHandler);
exports.default = app;
