import { Document, model, Schema } from "mongoose";

enum OrderStatus {
	PENDING = "pending",
	SHIPPED = "shipped",
	DELIVERED = "delivered",
	CANCELLED = "cancelled",
}

export interface IOrder extends Document {
	user: Schema.Types.ObjectId;
	items: IOrderItem[];
	totalPrice: number;
	status: OrderStatus;
	payment: Schema.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

export interface IOrderItem {
	book: Schema.Types.ObjectId;
	quantity: number;
	price: number;
}

const OrderSchema = new Schema<IOrder>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		items: [
			{
				book: {
					type: Schema.Types.ObjectId,
					ref: "Book",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
				price: {
					type: Number,
					required: true,
				},
			},
		],
		totalPrice: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(OrderStatus),
			default: OrderStatus.PENDING,
		},
		payment: {
			type: Schema.Types.ObjectId,
			ref: "Payment",
		},
	},
	{
		timestamps: true,
	}
);

const Order = model<IOrder>("Order", OrderSchema);
export default Order;