import { Request, Response, NextFunction } from 'express';
import Brand from '../models/brand.model';
import {catchAsync} from '../utils/catchAsyn.utils';
import {sendResponse} from '../utils/sendResponse.utils';
import {ApiError} from '../utils/apiError.utils'; 
import { removeFile, upload } from '../utils/cloudinary.utils';
import { IImage } from '../@types/globel.types';

// * upload folder
const folder = "/brands";
// Create Brand
export const createBrand = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, logo } = req.body;
  const file = req.file;

        if(!name){
              throw new ApiError("name is required", 400);
          }
          if(!file){
              throw new ApiError("logo is required", 400);
          }

  const brand = await Brand.findOne({ name: name });

  if(brand){
        throw new ApiError('brand:${name} already exist', 409);
    }

    // * creating brand instance
    const newBrand = new Brand({ name,description, logo });

    //* upload logo
    const {path, public_id} = await upload(file, folder);
    newBrand.logo = {
         path,
         publicId: public_id,

    }

    // * save 
    await newBrand.save();


  sendResponse(res, {
    data: newBrand,
    message: "Brand created successfully",
    statusCode: 201,
  });
});

// Get All Brands
export const getAllBrands = catchAsync(async (req: Request, res: Response) => {
  const brands = await Brand.find().sort({ createdAt: -1 });

//   success response
  sendResponse(res, {
    data: { brands },
    message: "Brands fetched successfully",
    statusCode: 200,
  });
});

// Get Single Brand
export const getBrand = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
  const brand = await Brand.findById({_id: id});

  if (!brand) {
    return next(new ApiError('No brand found with that ID', 404));
  }

  sendResponse(res, {
    data: { brand },
    message: "Brand fetched successfully",
    statusCode: 200,
  });
});

// Update Brand
export const updateBrand = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  const {name, description} = req.body;
  const file = req.file;
  
    if(!name){
     throw new ApiError("name is required", 400);
    }
    if(!file){
        throw new ApiError("logo is required", 400);
    }

  const brand = await Brand.findOne({ name: name });

  if(brand){
        throw new ApiError('brand:${name} already exist', 409);
    }

    const oldBrand = await Brand.findOne({ _id: id });

    if(!oldBrand){
        throw new ApiError('brand:${id} not found', 400);
    }

    if (name) oldBrand.name = name;
    if (description) oldBrand.description = description;
    
    if(file){

        // * delete old logo
        if (oldBrand.logo?.publicId) {
           await removeFile(oldBrand.logo.publicId);
        }

         //* upload new logo
        const {path, public_id} = await upload(file, folder);
        oldBrand.logo = {
         path,
         publicId: public_id,

        };
    }
    

    // * save 
    await oldBrand.save();


  sendResponse(res, {
    data: oldBrand,
    message: 'brand:${id} update',
    statusCode: 201,
  });
});

// Delete Brand
export const deleteBrand = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);

  if (!brand) {
    return next(new ApiError('No brand found with that ID', 404));
  }

  sendResponse(res, {
    message: "Brand deleted successfully",
    statusCode: 204,
  });
});