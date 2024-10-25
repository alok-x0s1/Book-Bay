import { z } from "zod";

export const signupSchema = z.object({
	name: z.string().min(1, "Name is required").max(50, "Name is too long"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signinSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateInfoSchema = z.object({
	name: z.string().min(1, "Name is required").max(50, "Name is too long"),
});

export const updatePasswordSchema = z.object({
	currentPassword: z
		.string()
		.min(6, "Password must be at least 6 characters"),
	newPassword: z.string().min(6, "Password must be at least 6 characters"),
});
