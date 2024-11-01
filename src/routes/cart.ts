import { Router } from "express";
import { addBookToCart, deleteBookFromCart, getCart } from "../controllers/cart";
import isLoggedIn from "../middleware/auth";

const router = Router();

router.route("/").post(isLoggedIn, addBookToCart).get(isLoggedIn, getCart);

router.route("/:bookId").delete(isLoggedIn, deleteBookFromCart);

export default router;
