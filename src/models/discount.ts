import { Document, model, Schema } from "mongoose";

export interface IDiscount extends Document {
	code: string;
	amount: number;
	books: Schema.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const DiscountSchema = new Schema<IDiscount>(
	{
		code: {
			type: String,
			required: true,
			unique: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		books: {
			type: Schema.Types.ObjectId,
			ref: "Book",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Discount = model<IDiscount>("Discount", DiscountSchema);
export default Discount;
