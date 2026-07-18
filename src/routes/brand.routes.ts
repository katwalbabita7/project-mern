import express from "express";

import {
    createBrand,getAllBrands,getBrand,updateBrand,deleteBrand
  
} from "../controllers/brand.controller";
import { uploder } from "../middlewares/multer.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { Role } from "../@types/enum.types";

const router = express.Router();
const upload = uploder();


router.post("/", authenticate([Role.ADMIN, Role.SUPER_ADMIN]), upload.single("logo"), createBrand);     
router.get("/", getAllBrands);                             
router.get("/:id", getBrand);                              
router.put("/:id", authenticate([Role.ADMIN, Role.SUPER_ADMIN]), upload.single("logo"), updateBrand);  
router.delete("/:id",authenticate([Role.ADMIN, Role.SUPER_ADMIN]),  deleteBrand);

export default router;