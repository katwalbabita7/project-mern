import mongoose from "mongoose";

export const connectDb = (DB_URI:string)=>{
    mongoose.connect(DB_URI)
    .then(async ()=>{
        console.log("Database connected");
        try {
            await mongoose.connection.collection('users').dropIndex('profile_image.publicId_1');
        } catch (e) {}
        try {
            await mongoose.connection.collection('users').dropIndex('profile_image_1');
        } catch (e) {}
    })
    .catch((err)=>{
        console.log("................Database connection error.....");
        console.log(err);
    });
};