import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import Order from "../models/order";
import stripe from "../utils/stripe";

const createPayment = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;

		const order = await Order.findOne({ user: userId, status: "pending" });

		if (!order) {
			errorResponse(res, "Order not found", 404);
			return;
		}

		const paymentIntent = await stripe.paymentIntents.create({
			amount: order.totalPrice * 100,
			currency: "usd",
			payment_method_types: ["card"],
			metadata: {
				order_id: order._id?.toString()!,
			},
		});

		successResponse(res, "Payment intent created successfully", {
			clientSecret: paymentIntent.client_secret,
		});
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

const getPayementDetails = async (req: Request, res: Response) => {
	try {
		const paymentIntentId = req.params.id;
		const paymentIntent = await stripe.paymentIntents.retrieve(
			paymentIntentId
		);
		successResponse(res, "Payment intent retrieved successfully", {
			paymentIntent,
		});
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

export { createPayment, getPayementDetails };
