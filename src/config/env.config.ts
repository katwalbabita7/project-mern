import "dotenv/config";
// import cloudinary from "./cloudinary.config";

const ENV_CONFIG = {
  PORT: process.env.PORT ,
  DB_URI: process.env.DB_URI || "",

  
// * cloudinary
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME  ,
  cloudinary_api_key : process.env.CLOUDINARY_API_KEY ,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET ,


// !JWT
jwt_secret: process.env.JWT_SECRET !!,
jwt_expires_in: process.env.JWT_EXPIRES_IN !!, 
};

export default ENV_CONFIG;