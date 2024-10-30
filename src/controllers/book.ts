import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import Book from "../models/book";
import { bookSchema, updateBookSchema } from "../schema/book";
import Category from "../models/category";

const getBooks = async (req: Request, res: Response) => {
	try {
		const limit = parseInt(req.query.limit as string) || 20;
		const page = parseInt(req.query.page as string) || 1;
		const skip = (page - 1) * limit;

		const sortField = (req.query.sortField as string) || "title";
		const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
		const searchQuery = req.query.search as string;
		const minPrice = parseFloat(req.query.minPrice as string);
		const maxPrice = parseFloat(req.query.maxPrice as string);
		const minRating = parseFloat(req.query.minRating as string);
		const category = req.query.category as string;

		const filter: any = {};

		if (searchQuery) {
			filter.$or = [
				{ title: { $regex: searchQuery, $options: "i" } },
				{ author: { $regex: searchQuery, $options: "i" } },
			];
		}

		if (minPrice || maxPrice) {
			filter.price = {};
			if (minPrice) filter.price.$gte = minPrice;
			if (maxPrice) filter.price.$lte = maxPrice;
		}

		if (minRating) {
			filter.rating = { $gte: minRating };
		}

		if (category) {
			filter.category = category;
		}

		const books = await Book.find(filter)
			.sort({
				[sortField]: sortOrder,
			})
			.skip(skip)
			.limit(limit);

		const paginationInfo = {
			totalBooks: await Book.countDocuments(),
			totalPages: Math.ceil((await Book.countDocuments()) / limit),
			currentPage: page,
			hasNextPage:
				page < Math.ceil((await Book.countDocuments()) / limit),
			hasPreviousPage: page > 1,
			pageSize: limit,
		};

		successResponse(
			res,
			"Books fetched successfully",
			{ books, paginationInfo },
			200
		);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

const getSingleBook = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const book = await Book.findById(id);

		if (!book) {
			errorResponse(res, "Book not found", 404);
			return;
		}

		successResponse(res, "Book fetched successfully", book, 200);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

const createBook = async (req: Request, res: Response) => {
	try {
		const validData = bookSchema.safeParse(req.body);
		if (!validData.success) {
			errorResponse(res, "Invalid data", 400, validData.error);
			return;
		}

		const { title, author, description, price, stock, category } =
			validData.data;

		const newBook = await Book.create({
			title,
			author,
			description,
			price,
			stock,
			category,
		});

		const existingCategory = await Category.findOne({
			name: category,
		});
		if (!existingCategory) {
			errorResponse(res, "Category not found", 404);
			return;
		}
		existingCategory.books.push(newBook._id);
		await existingCategory.save();

		successResponse(res, "Book created successfully", newBook, 201);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

const updateBook = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const validData = updateBookSchema.safeParse(req.body);
		if (!validData.success) {
			errorResponse(res, "Invalid data", 400, validData.error);
			return;
		}

		const { title, author, description, price, stock } = validData.data;

		const updatedBook = await Book.findByIdAndUpdate(id, {
			title,
			author,
			description,
			price,
			stock,
		});

		if (!updatedBook) {
			errorResponse(res, "Book not found", 404);
			return;
		}

		successResponse(res, "Book updated successfully", updatedBook, 200);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

const deleteBook = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const deletedBook = await Book.findByIdAndDelete(id);

		if (!deletedBook) {
			errorResponse(res, "Book not found", 404);
			return;
		}

		await Category.findOneAndUpdate(
			{
				name: deletedBook.category,
			},
			{
				$pull: {
					books: deletedBook._id,
				},
			}
		);

		successResponse(res, "Book deleted successfully", {}, 200);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

export { getBooks, getSingleBook, createBook, updateBook, deleteBook };
