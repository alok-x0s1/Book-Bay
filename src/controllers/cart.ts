import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import { cartSchema } from "../schema/cart";
import Book from "../models/book";
import Cart from "../models/cart";
import mongoose from "mongoose";

const addBookToCart = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;
		const validData = cartSchema.safeParse(req.body);
		if (!validData.success) {
			errorResponse(res, "Invalid data", 400, validData.error);
			return;
		}

		const { bookId, quantity } = validData.data;
		const existingBook = await Book.findById(bookId);
		if (!existingBook) {
			errorResponse(res, "Book not found", 404);
			return;
		}

		let cart = await Cart.findOne({ user: userId });

		if (!cart) {
			cart = new Cart({ user: userId, items: [] });
		}

		const bookInCart = cart.items.find(
			(item) => item.book.toString() === bookId
		);
		if (bookInCart) {
			bookInCart.quantity += quantity;
		} else {
			cart.items.push({
				book: new mongoose.SchemaTypes.ObjectId(bookId),
				quantity,
			});
		}

		await cart.save();
		successResponse(res, "Book added to cart successfully", {}, 201);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

const getCart = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;
		const cart = await Cart.findOne({ user: userId }).populate(
			"items.book"
		);
		if (!cart) {
			errorResponse(res, "Cart not found", 404);
			return;
		}
		successResponse(res, "Cart fetched successfully", cart, 200);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

const deleteBookFromCart = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;
		const { bookId } = req.params;
		const cart = await Cart.findOne({ user: userId });
		if (!cart) {
			errorResponse(res, "Cart not found", 404);
			return;
		}
		const bookIndex = cart.items.findIndex(
			(item) => item.book.toString() === bookId
		);
		if (bookIndex === -1) {
			errorResponse(res, "Book not found in cart", 404);
			return;
		}
		cart.items.splice(bookIndex, 1);
		await cart.save();
		successResponse(res, "Book removed from cart successfully", {}, 200);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

export { addBookToCart, getCart, deleteBookFromCart };
