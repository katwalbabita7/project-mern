import express,{NextFunction, Request,Response,} from "express";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import brandRoutes from "./routes/brand.routes";
import cookieParser from "cookie-parser";

// * app instance
const app = express();

// * using middleware
app.use(cookieParser());
app.use(express.json({limit: "10mb"}));



// *using routes

app.get("/",(req:Request,res:Response,next:NextFunction)=>{
    res.status(200).json({
        message:"server is up & running",
        success:true,
        status:'success',
        data:null,
    })
})

// * using route
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/brand", brandRoutes);




// * error handler route
app.use((req,res,next)=>{
    const error: any = new Error(`Can not ${req.method} on ${req.path}`);
    error.statusCode = 404;
    error.status = "fail";
    next(error);
});

export default app;