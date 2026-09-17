import { z } from "zod";

export const adminLoginSchema = z.object({
  body: z.object({
    email: z
      .string({
        error: (issue) =>
          issue.input === undefined ? "email is required" : "email must be a string",
      })
      .email("invalid email"),

    password: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "password is required"
            : "password must be a string",
      })
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),
  }),
});