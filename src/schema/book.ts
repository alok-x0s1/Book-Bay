import { z } from "zod";

export const bookSchema = z.object({
    title: z.string().min(3, "Title is required").max(50, "Title is too long"),
    author: z
        .string()
        .min(3, "Author is required")
        .max(50, "Author is too long"),
    description: z
        .string()
        .min(3, "Description is required")
        .max(500, "Description is too long"),
    price: z
        .string()
        .refine((val) => !isNaN(Number(val)), {
            message: "Price must be a number"
        })
        .transform((val) => Number(val)),
    stock: z
        .string()
        .min(1, "Stock must be at least 1")
        .refine((val) => !isNaN(Number(val)), {
            message: "Stock must be a number"
        })
        .transform((val) => Number(val)),

    category: z.string()
});

export const updateBookSchema = z.object({
    title: z.string().min(3, "Title is required").max(50, "Title is too long"),
    author: z
        .string()
        .min(3, "Author is required")
        .max(50, "Author is too long"),
    description: z
        .string()
        .min(3, "Description is required")
        .max(500, "Description is too long"),
    price: z
        .string()
        .refine((val) => !isNaN(Number(val)), {
            message: "Price must be a number"
        })
        .transform((val) => Number(val)),
    stock: z
        .string()
        .min(1, "Stock must be at least 1")
        .refine((val) => !isNaN(Number(val)), {
            message: "Stock must be a number"
        })
        .transform((val) => Number(val))
});
