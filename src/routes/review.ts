import { Router } from "express";
import isLoggedIn from "../middleware/auth";
import {
	addReview,
	deleteReview,
	editReview,
	getAllReviews,
} from "../controllers/review";

const router = Router();

router.route("/:bookId").post(isLoggedIn, addReview);
router
	.route("/:reviewId")
	.patch(isLoggedIn, editReview)
	.delete(isLoggedIn, deleteReview);

router.route("/:bookId/all").get(getAllReviews);

export default router;
