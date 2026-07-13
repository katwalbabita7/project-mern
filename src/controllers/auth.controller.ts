import { NextFunction, Request, Response } from "express";
import {hash, compare} from "../utils/bcrypt.utils";
import User from "../models/user.model";
import { ApiError  } from "../utils/apiError.utils";
import { catchAsync } from "../utils/catchAsyn.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import {upload} from "../utils/cloudinary.utils";

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
                public_id,
            };

        }

        // * save 
        await user.save();
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

// const token = generateToken(user._id.toString());

sendResponse(res,{
    data:user,
    message:"Login Success",
    statusCode:201,
});
},
);


// * change password

// * forget password

// * get profile

// * change email

// * 
