import express,{NextFunction, Request,Response,} from "express";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import brandRoutes from "./routes/brand.routes";
import productsRouts from "./routes/product.routes";
import categoryRouts from "./routes/category.routes";
import wishlistRouts from "./routes/wishlist.routes";
import cookieParser from "cookie-parser";
import cartRouter from "./routes/cart.routes";
import {errorHandler} from "./middlewares/errorhandler.middleware";

// * app instance
const app = express();

// * using middleware
app.use(cookieParser());
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
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/products",productsRouts);
app.use("/api/category",categoryRouts);
app.use("/api/wishlist",wishlistRouts);
app.use('/api/v1/cart', cartRouter);

// *JSON Parser
app.use(express.json({limit: "10mb"}));

app.use(errorHandler);



// * error handler route
app.use((req,res,next)=>{
    const error: any = new Error(`Can not ${req.method} on ${req.path}`);
    error.statusCode = 404;
    error.status = "fail";
    next(error);
});

export default app;