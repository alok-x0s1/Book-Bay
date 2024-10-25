import { z } from "zod";

export const categorySchema = z.object({
	name: z.string().min(1, "Name is required").max(50, "Name is too long"),
});

export const updateCategorySchema = z.object({
	name: z.string().min(1, "Name is required").max(50, "Name is too long"),
});
