import {NextFunction, Request, Response} from "express";
import {z} from "zod";

export const validate = (schema: z.ZodObject)=>{
    return (req:Request, res:Response, next:NextFunction)=>{
        const result = schema.safeParse({
            body:req.body,
            params: req.params,
            query: req.query,
        });

        // * if validation failed path:['body','full_name']
        if(!result.success){
            const errors = result.error.issues.map(({path, message})=>{
                return{
                    path:path.join("."),
                    message,
                };
            });
            return next({
                message:"validation error",
                statusCode:400,
                status:"fail",
                errors,
            });
        }

        // * if validation success
        req.body = result.data.body;
        req.params = result.data.params as Record<string, any>;
        Object.assign(req.query, result.data.query);
        next();
    };
};