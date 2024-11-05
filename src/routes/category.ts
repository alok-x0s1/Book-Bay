import { Router } from "express";
import {
	createCategory,
	getAllCategories,
	getBooksByCategory,
	updatedCategory,
} from "../controllers/category";
import isLoggedIn from "../middleware/auth";
import isAdmin from "../middleware/admin";

const router = Router();

router
	.route("/")
	.get(getAllCategories)
	.post(isLoggedIn, isAdmin, createCategory);
router.route("/:id").patch(isLoggedIn, isAdmin, updatedCategory);
router.route("/books").get(getBooksByCategory);

export default router;