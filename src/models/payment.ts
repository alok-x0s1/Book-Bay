import { Document, model, Schema } from "mongoose";

enum PaymentStatus {
	PENDING = "pending",
	COMPLETED = "completed",
	FAILED = "failed",
}

interface IPayment extends Document {
	order: Schema.Types.ObjectId;
	amount: number;
	status: PaymentStatus;
	createdAt: Date;
	updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
	{
		order: {
			type: Schema.Types.ObjectId,
			ref: "Order",
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(PaymentStatus),
			default: PaymentStatus.PENDING,
		},
	},
	{
		timestamps: true,
	}
);

const Payment = model<IPayment>("Payment", PaymentSchema);
export default Payment;