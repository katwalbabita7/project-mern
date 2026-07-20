import { NextFunction, Request, Response } from "express";
import {hash, compare} from "../utils/bcrypt.utils";
import User from "../models/user.model";
import { ApiError  } from "../utils/apiError.utils";
import { catchAsync } from "../utils/catchAsyn.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import {upload} from "../utils/cloudinary.utils";
import {generateToken,verifyJwtToken} from "../utils/jwt.utils";
import ENV_CONFIG from "../config/env.config";
import { IImage } from "../@types/globel.types";
import {sendEmail} from "../utils/sendEmailService.utils";
import {accountCreatedEmailHtml, loginDetectedEmailHtml} from "../utils/emailTemplate.utils";

const uploadFolder = "/profiles";


// * register(create user)
export const register = catchAsync(
    async (req:Request,res:Response,next:NextFunction) => {
        const { full_name, email, password, phone,} = req.body;
        const file = req.file;
    //     console.log("req.file =", req.file);
    // console.log("req.body =", req.body);
        if(!full_name){
            throw new ApiError("full_name is required", 400);
        }
        if(!email){
            throw new ApiError("email is required", 400);
        }
        if(!password){
            throw new ApiError("password is required", 400);
        }

        // const user = await User.create({full_name, email, password, phone});
        const user = new User({full_name, email, phone});

        // * password hash
        const hashPass = await hash(password);
        user.password = hashPass;

        // * handle image upload
        if(file){
            // user.profile_image = file.path;
            const {path , public_id} = await upload(file, uploadFolder);
            user.profile_image = {
                path,
                publicId: public_id,
            };

        }

        // * save 
        await user.save();
        // * send account created email
        sendEmail({
            to : "katwalbabita59@gmail.com",
            // to:user.email,
            subject :"Account Created",
            html: accountCreatedEmailHtml({
                fullName : user.full_name,
                email : user.email,
                createdAt: user.createdAt,
            })
        })
        // * send success response
        // res.status(201).json({
        //     message:"Account created",
        //     success:true,
        //     status:"Success",
        //     data: user,

        sendResponse(res,{
            data:user,
            message:"Account Created",
            statusCode:201,
        });
    },
);
// * login
export const login = catchAsync(
    async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const { email, password } = req.body;

    if(!email){
    throw new ApiError("email is required", 400);
    }
    if(!password){
    throw new ApiError("password is required", 400);
    }

        // const { email, password } = req.body;

//* Find user by email
const user = await User.findOne({ email }).select("+password");

if (!user) {
    throw new ApiError("Invalid Credentia", 400);

}
// * compare password
const isPassMatched = compare(password,user.password);

if (!isPassMatched) {
     throw new ApiError("Invalid Credentia", 400);

}

// * generate JWT token
const access_token = generateToken({
_id: user._id,
email: user.email,
role: user.role,
full_name: user.full_name, 
});

// * send account created email
        sendEmail({
            to : "katwalbabita59@gmail.com",
            // to:user.email,
            subject :"Login Detected",
            html: loginDetectedEmailHtml({
                fullName : user.full_name,
                email : user.email,
                loginAt: new Date(Date.now()),
            })
        })


// * set cookie
res.cookie('access_token', access_token,{
    httpOnly: ENV_CONFIG.node_env === "development" ? false : true,
    maxAge: Number(ENV_CONFIG.cookie_expire ?? "7") * 24 * 60 * 60 * 1000,
    sameSite: ENV_CONFIG.node_env === "development" ? "lax" : "none",
    secure: ENV_CONFIG.node_env === "development" ? false : true,
});
// const token = generateToken(user._id.toString());

sendResponse(res,{
    message:"Login Success",
    data:{
    data: user,
    access_token,
    },
    statusCode:201,
});
},
);


// * Get Profile (Only own profile)
export const getProfile = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?._id;

        if (!userId) {
            throw new ApiError("Please login to access this resource", 401);
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            throw new ApiError("User not found", 404);
        }

        sendResponse(res, {
            message: "Profile fetched successfully",
            data: user,
            statusCode: 200,
        });
    }
);

// * Delete Account (Only own account)
export const deleteAccount = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?._id;

        if (!userId) {
            throw new ApiError("Please login to access this resource", 401);
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError("User not found", 404);
        }

        await User.findByIdAndDelete(userId);

        // Clear cookie
        res.clearCookie('access_token', {
            httpOnly: ENV_CONFIG.node_env === "development" ? false : true,
            sameSite: ENV_CONFIG.node_env === "development" ? "lax" : "none",
            secure: ENV_CONFIG.node_env === "development" ? false : true,
        });

        sendResponse(res, {
            message: "Account deleted successfully",
            data: null,
            statusCode: 200,
        });
    }
);

// * change password

// * forget password

// * get profile


// * change email

// * 
