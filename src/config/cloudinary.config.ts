import {v2 as cloudinary} from "cloudinary";
import ENV_CONFIG from "./env.config";
// api key

cloudinary.config({ 
  cloud_name: ENV_CONFIG.cloud_name, 
  api_key: ENV_CONFIG.cloudinary_api_key, 
  api_secret: ENV_CONFIG.cloudinary_api_secret,
});

export default cloudinary;