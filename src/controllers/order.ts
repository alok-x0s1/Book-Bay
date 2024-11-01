import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import Cart from "../models/cart";
import { orderSchema } from "../schema/order";
import Order from "../models/order";
import Book from "../models/book";

const createOrder = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;

		const validData = orderSchema.safeParse(req.body);
		if (!validData.success) {
			errorResponse(res, "Invalid data", 400, validData.error);
			return;
		}

		const { orderItems } = validData.data;
		const totalAmount = orderItems.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);

		orderItems.forEach(async (item) => {
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
		});

		const newOrder = await Cart.create({
			user: userId,
			items: orderItems,
			totalPrice: totalAmount,
		});

		await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

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
