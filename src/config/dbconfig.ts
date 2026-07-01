import mongoose from "mongoose";

export const connectDb = (DB_URI:string)=>{
    mongoose.connect(DB_URI)
    .then(()=>{
        console.log("Database connected");
    })
    .catch((err)=>{
        console.log("................Database connection error.....");
        console.log(err);
    });
};