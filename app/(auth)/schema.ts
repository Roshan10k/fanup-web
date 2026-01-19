import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginType = z.infer<typeof loginSchema>;

//Signup schema
export const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/\d/, "Password must contain a number"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupType = z.infer<typeof signupSchema>;
