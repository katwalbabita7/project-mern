import { NextFunction, Request, Response } from "express";

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

        const user = await User.create({full_name, email, password, phone});

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


// * change password

// * forget password

// * get profile

// * change email

// * 
