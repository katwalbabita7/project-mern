import "dotenv/config";
// import cloudinary from "./cloudinary.config";

const ENV_CONFIG = {
  PORT: process.env.PORT ,
  DB_URI: process.env.DB_URI || "",
  node_env: process.env.NODE_ENV,

  
// * cloudinary
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME  ,
  cloudinary_api_key : process.env.CLOUDINARY_API_KEY ,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET ,


// !JWT
jwt_secret: process.env.JWT_SECRET !!,
jwt_expires_in: process.env.JWT_EXPIRES_IN !!, 

// * cookie
cookie_expire: process.env.COOKIE_EXPIRE,

// * email /
smtp_host : process.env.SMTP_HOST !!,
smtp_service : process.env.SMTP_SERVICE !!,
smtp_port : Number(process.env.SMTP_PORT) ?? 587,
smtp_user : process.env.SMTP_USER !!,
smtp_pass : process.env.SMTP_PASS !!,
smtp_mail_from : process.env.SMTP_MAIL_FROM !!,



};

export default ENV_CONFIG;