"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLoginSchema = void 0;
const zod_1 = require("zod");
exports.adminLoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            error: (issue) => issue.input === undefined ? "email is required" : "email must be a string",
        })
            .email("invalid email"),
        password: zod_1.z
            .string({
            error: (issue) => issue.input === undefined
                ? "password is required"
                : "password must be a string",
        })
            .min(6, "Password must be at least 6 characters")
            .max(100, "Password is too long"),
    }),
});
