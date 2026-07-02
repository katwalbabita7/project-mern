import { NextFunction, Request, Response } from "express";
import {hash, compare} from "../utils/bcrypt.utils";
import User from "../models/user.model";
// * register(create user)
export const register = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const { full_name, email, password, phone } = req.body;
        if(!full_name){
            const error: any = new Error("full_name is required");
            error.statusCode = 400;
            error.status= "fail";
            throw error;
        }
        if(!email){
            const error: any = new Error("email is required");
            error.statusCode = 400;
            error.status= "fail";
            throw error;
        }
        if(!password){
            const error: any = new Error("password is required");
            error.statusCode = 400;
            error.status= "fail";
            throw error;
        }

        // const user = await User.create({full_name, email, password, phone});
        const user = new User({full_name, email, phone});

        // * password hash
        const hashPass = await hash(password);
        user.password = hashPass;

        // * handle image upload

        // * save 
        await user.save();
        // * send success response
        res.status(201).json({
            message:"Account created",
            success:true,
            status:"Success",
            data: user,
        })
    }catch(error){
        next(error);
    }
    
}
// * login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if(!email){
            const error: any = new Error("email is required");
            error.statusCode = 400;
            error.status= "fail";
            throw error;
        }
        if(!password){
            const error: any = new Error("password is required");
            error.statusCode = 400;
            error.status= "fail";
            throw error;
        }

        // const { email, password } = req.body;

//* Find user by email
const user = await User.findOne({ email }).select("+password");

if (!user) {
    const error: any = new Error("Invalid Credential");
    error.statusCode = 400;
    error.status = "fail";
    throw error;
}
// * compare password
const isPassMatched = compare(password,user.password);

if (!isPassMatched) {
    const error: any = new Error("Invalid Credential");
    error.statusCode = 400;
    error.status = "fail";
    throw error;
}

// * generate JWT token

// const token = generateToken(user._id.toString());

res.status(201).json({
    message: "Login successful",
    success: true,
    status: "Success",
    data: user,
});
  } catch (error) {
    next(error);
  }
};


// * change password

// * forget password

// * get profile

// * change email

// * 
