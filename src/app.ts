import express,{NextFunction, Request,Response,} from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import brandRoutes from "./routes/brand.routes";
import productsRoutes from "./routes/product.routes";
import categoriesRoutes from "./routes/category.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import adminAuthRoutes from "./routes/adminAuth.routes";
import cookieParser from "cookie-parser";
import cartRouter from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import {errorHandler} from "./middlewares/errorhandler.middleware";
import corsOptions from "./config/cors.config";

// * app instance
const app = express();

// * CORS
app.use(cors(corsOptions));

//* Cookie parser
app.use(cookieParser());

// * using middleware
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true }));

// *using routes
app.get("/",(req:Request,res:Response,next:NextFunction)=>{
    res.status(200).json({
        message:"server is up & running",
        success:true,
        status:'success',
        data:null,
    })
})

// * using routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin/auth", adminAuthRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/admin/brands", brandRoutes);
app.use("/api/v1/products",productsRoutes);
app.use("/api/v1/admin/products", productsRoutes);
app.use("/api/v1/categories",categoriesRoutes);
app.use("/api/v1/admin/categories",categoriesRoutes);
app.use("/api/v1/wishlist",wishlistRoutes);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/orders', orderRoutes);

// * error handler route
app.use((req,res,next)=>{
    const error: any = new Error(`Can not ${req.method} on ${req.path}`);
    error.statusCode = 404;
    error.status = "fail";
    next(error);
});
//* Global error handler
app.use(errorHandler);

export default app;