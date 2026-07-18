import express from "express";

import {
    createBrand,getAllBrands,getBrand,updateBrand,deleteBrand
  
} from "../controllers/brand.controller";
import { uploder } from "../middlewares/multer.middleware";

const router = express.Router();
const upload = uploder();


router.post("/", upload.single("logo"), createBrand);     
router.get("/", getAllBrands);                             
router.get("/:id", getBrand);                              
router.put("/:id", upload.single("logo"), updateBrand);  
router.delete("/:id", deleteBrand);

export default router;