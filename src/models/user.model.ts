import mongoose from "mongoose";
import { Role } from "../@types/enum.types";
import { imageSchema } from "./image.model";
// * user schema
export const userSchema = new mongoose.Schema(
    {
        full_name:{
            type:String,
            required:[true,"full_name is required"],
            minLength:[3,"full_name must be at least 3 characters."],
        },
        email:{
            type:String,
            required:[true,"email  is required"],
            unique:[true,"user already exists with proviede email"],
        },
        password:{
            type:String,
            required:[true,"password is required"],
            select:false,
        },
        role:{
            type:String,
            enum:Object.values(Role),
            default:Role.USER,
        },
        profile_image:{
            type:imageSchema,
            default: null,
        },
        phone:{
            type:String,
        },
    },
    {
        timestamps:true
    },
);

// user model 
const User = mongoose.model("user",userSchema);
export default User;