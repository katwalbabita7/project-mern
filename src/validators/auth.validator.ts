import { z } from 'zod';

//*REGISTER USER SCHEMA
export const registerUserSchema = z.object({
    body: z.object({
        full_name: z
        .string({
        error: (issue) =>
            issue.input === undefined ? "full_name is required" : "full_name must be a string",
        })
    .trim()
    .min(2, "full_name must be at least 2 characters")
    .max(50, "full_name cannot exceed 50 characters")
    // check name string or number
    .refine(
        (val) => typeof Number(val) !== "number",
        "full_name must be a string",
    ),

    email: z.email({
        error:(issue)=>
       issue.input === undefined ? "email is required" : "invalid email",
    }),
    

    password: z
    .string({
        error:(issue)=>
       issue.input === undefined ? "password is required" : "password must be a string",
    })
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long')
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
        'Password must contain at least one uppercase, one lowercase and one number'
    ),
    // Allow file upload
  files: z.object({
    profile_image: z.any().optional()
  }).optional(),
}),
});