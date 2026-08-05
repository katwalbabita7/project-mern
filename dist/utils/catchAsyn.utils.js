"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = void 0;
const catchAsync = (fn) => {
    return (req, res, next) => {
        // try{
        //   fn(req, res, next);
        // }catch(error){
        // next(error);
        // }
        // Promise function
        Promise.resolve(fn(req, res, next)).catch((error) => next(error));
    };
};
exports.catchAsync = catchAsync;
