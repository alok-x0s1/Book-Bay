import { z } from "zod";

export const orderSchema = z.object({
	orderItems: z.array(
		z.object({
			book: z.string().min(1, "Book ID is required"),
			quantity: z.number().min(1, "Quantity must be at least 1"),
			price: z.number(),
		})
	),
});
