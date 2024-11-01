import { Router } from "express";
import isLoggedIn from "../middleware/auth";
import { createOrder, getAllOrders, getOrderById } from "../controllers/order";

const router = Router();

router.route("/create").post(isLoggedIn, createOrder);
router.route("/all").get(isLoggedIn, getAllOrders);
router.route("/:id").get(isLoggedIn, getOrderById);

export default router;
