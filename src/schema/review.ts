import { z } from "zod";

export const reviewSchema = z.object({
    comment: z.string().min(1, "Comment is required"),
    rating: z
        .string()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5")
        .refine((val) => !isNaN(Number(val)), {
            message: "Rating must be a number"
        })
        .transform((val) => Number(val))
});

export const updateReviewSchema = z.object({
    comment: z.string().min(1, "Comment is required"),
    rating: z
        .string()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5")
        .refine((val) => !isNaN(Number(val)), {
            message: "Rating must be a number"
        })
        .transform((val) => Number(val))
});
