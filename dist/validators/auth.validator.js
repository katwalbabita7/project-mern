"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserSchema = void 0;
const zod_1 = require("zod");
//*REGISTER USER SCHEMA
exports.registerUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        full_name: zod_1.z
            .string({
            error: (issue) => issue.input === undefined ? "full_name is required" : "full_name must be a string",
        })
            .trim()
            .min(2, "full_name must be at least 2 characters")
            .max(50, "full_name cannot exceed 50 characters")
            // check name string or number
            .refine((val) => typeof Number(val) !== "number", "full_name must be a string"),
        email: zod_1.z.email({
            error: (issue) => issue.input === undefined ? "email is required" : "invalid email",
        }),
        password: zod_1.z
            .string({
            error: (issue) => issue.input === undefined ? "password is required" : "password must be a string",
        })
            .min(6, 'Password must be at least 6 characters')
            .max(100, 'Password is too long')
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase, one lowercase and one number'),
        // Allow file upload
        files: zod_1.z.object({
            profile_image: zod_1.z.any().optional()
        }).optional(),
    }),
});
