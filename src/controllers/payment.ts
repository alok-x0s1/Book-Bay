import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import Order, { OrderStatus } from "../models/order";
import stripe from "../utils/stripe";
import Payment, { PaymentStatus } from "../models/payment";

const createPayment = async (req: Request, res: Response) => {
	try {
		const userId = req.user?._id;

		const order = await Order.findOne({ user: userId, status: "pending" });

		if (!order) {
			errorResponse(res, "Order not found", 404);
			return;
		}

		const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.totalPrice * 100),
            currency: "usd",
            payment_method_types: ["card"],
            metadata: {
                order_id: order._id.toString(),
            },
        });

        const payment = new Payment({
            order: order._id,
            amount: order.totalPrice,
            status: PaymentStatus.PENDING,
        });
        await payment.save();

		const paymentIntentStatus = paymentIntent.status;

        if (paymentIntentStatus === "succeeded") {
            payment.status = PaymentStatus.COMPLETED;
			await payment.save();

			order.status = OrderStatus.SHIPPED;
			await order.save();
        }

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
