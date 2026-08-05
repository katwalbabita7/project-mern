"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const brand_routes_1 = __importDefault(require("./routes/brand.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const wishlist_routes_1 = __importDefault(require("./routes/wishlist.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const errorhandler_middleware_1 = require("./middlewares/errorhandler.middleware");
// * app instance
const app = (0, express_1.default)();
// * using middleware
app.use((0, cookie_parser_1.default)());
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
app.use("/users", user_routes_1.default);
app.use("/auth", auth_routes_1.default);
app.use("/api/brand", brand_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/category", category_routes_1.default);
app.use("/api/wishlist", wishlist_routes_1.default);
app.use('/api/v1/cart', cart_routes_1.default);
// *JSON Parser
app.use(express_1.default.json({ limit: "10mb" }));
app.use(errorhandler_middleware_1.errorHandler);
// * error handler route
app.use((req, res, next) => {
    const error = new Error(`Can not ${req.method} on ${req.path}`);
    error.statusCode = 404;
    error.status = "fail";
    next(error);
});
exports.default = app;
