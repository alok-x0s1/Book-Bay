import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import { reviewSchema, updateReviewSchema } from "../schema/review";
import Book from "../models/book";
import Review from "../models/review";
import { date } from "zod";

const addReview = async (req: Request, res: Response) => {
	try {
		const { bookId } = req.params;
		const userId = req.user?._id;

		const validData = reviewSchema.safeParse(req.body);
		if (!validData.success) {
			errorResponse(res, "Invalid data", 400, validData.error);
			return;
		}

		const { rating, comment } = validData.data;

		const existingBook = await Book.findById(bookId);
		if (!existingBook) {
			errorResponse(res, "Book not found", 404);
			return;
		}

		const existingReview = await Review.findOne({
			user: userId,
			book: bookId,
		});

		if (existingReview) {
			errorResponse(res, "Review already exists", 400);
			return;
		}

		const newReview = await Review.create({
			rating,
			comment,
			user: userId,
			book: bookId,
		});
		existingBook.reviews.push(newReview._id);
		existingBook.ratings = (existingBook.ratings + rating) / 2;

		await existingBook.save();

		successResponse(res, "Review added successfully", newReview, 201);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

const editReview = async (req: Request, res: Response) => {
	try {
		const { reviewId } = req.params;
		const userId = req.user?._id;

		const validData = updateReviewSchema.safeParse(req.body);
		if (!validData.success) {
			errorResponse(res, "Invalid data", 400, validData.error);
			return;
		}

		const { rating, comment } = validData.data;

		const existingReview = await Review.findById(reviewId);
		if (!existingReview) {
			errorResponse(res, "Review not found or unauthorized", 404);
			return;
		}

		if (existingReview.user.toString() !== userId) {
			errorResponse(res, "Unauthorized", 401);
			return;
		}

		existingReview.rating = rating;
		existingReview.comment = comment;
		await existingReview.save();

		successResponse(res, "Review edited successfully", existingReview, 200);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

const getAllReviews = async (req: Request, res: Response) => {
	try {
		const { bookId } = req.params;
		const book = await Book.findById(bookId);
		if (!book) {
			errorResponse(res, "Book not found", 404);
			return;
		}

		const reviews = await Review.find({ book: bookId })
			.populate("user", "name")
			.sort({
				date: -1,
			});
		if (!reviews) {
			errorResponse(res, "Reviews not found", 404);
			return;
		}

		successResponse(res, "Reviews fetched successfully", reviews, 200);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

const deleteReview = async (req: Request, res: Response) => {
	try {
		const { reviewId } = req.params;
		const userId = req.user?._id;

		const review = await Review.findOneAndDelete({
			_id: reviewId,
			user: userId,
		});
		if (!review) {
			errorResponse(
				res,
				"Review not found or you are not authorized to delete",
				404
			);
			return;
		}

		successResponse(res, "Review deleted successfully", {}, 200);
	} catch (error) {
		console.error(error);
		errorResponse(res, "Error deleting review", 500, error);
	}
};

export { addReview, editReview, getAllReviews, deleteReview };
