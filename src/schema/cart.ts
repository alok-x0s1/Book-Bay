import { z } from "zod";

export const cartSchema = z.object({
	bookId: z.string().min(1, "Book ID is required"),
	quantity: z.number().min(1, "Quantity must be at least 1"),
});
