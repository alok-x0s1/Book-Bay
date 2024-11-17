import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import Cart from "../models/cart";
import Order from "../models/order";
import Book from "../models/book";

const createOrder = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;

		// const validData = orderSchema.safeParse(req.body);
		// if (!validData.success) {
		// 	errorResponse(res, "Invalid data", 400, validData.error);
		// 	return;
		// }

		// const { orderItems } = validData.data;

		// let totalAmount = 0

		// orderItems.forEach(async (item) => {
		// 	const book = await Book.findOne({ _id: item.book });
		// 	if (!book) {
		// 		errorResponse(res, "Book not found", 404);
		// 		return;
		// 	}

		// 	if (book.stock < item.quantity) {
		// 		errorResponse(res, "Insufficient stock", 400);
		// 		return;
		// 	}

		// 	book.stock -= item.quantity;
		// 	await book.save();

		// 	totalAmount += book.price * item.quantity
		// });

		// const newOrder = await Cart.create({
		// 	user: userId,
		// 	items: orderItems,
		// 	totalPrice: totalAmount,
		// });

		// await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

		const cart = await Cart.findOne({ user: userId });
		if (!cart) {
			errorResponse(res, "Cart not found", 404);
			return;
		}

		if(cart.items.length === 0) {
			errorResponse(res, "Cart is empty", 400);
			return;
		}

		let totalAmount = 0;
		cart.items.forEach(async (item) => {
			const book = await Book.findOne({ _id: item.book });
			if (!book) {
				errorResponse(res, "Book not found", 404);
				return;
			}

			if (book.stock < item.quantity) {
				errorResponse(res, "Insufficient stock", 400);
				return;
			}

			book.stock -= item.quantity;
			await book.save();

			totalAmount += book.price * item.quantity;
		})

		const newOrder = await Order.create({
			user: userId,
			items: cart.items,
			totalPrice: totalAmount,
		});

		successResponse(res, "Order created successfully", newOrder, 200);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

const getAllOrders = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;
		const orders = await Order.find({ user: userId }).populate(
			"user items.book"
		);

		successResponse(res, "Orders fetched successfully", orders, 200);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

const getOrderById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const order = await Order.findById(id).populate("user items.book");

		if (!order) {
			errorResponse(res, "Order not found", 404);
			return;
		}

		successResponse(res, "Order fetched successfully", order, 200);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

export { createOrder, getAllOrders, getOrderById };
