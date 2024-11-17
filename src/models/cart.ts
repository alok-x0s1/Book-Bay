import mongoose, { Document, model, Schema } from "mongoose";

export interface ICartItems {
	book: mongoose.Types.ObjectId;
	quantity: number;
}

export interface ICart extends Document {
	user: mongoose.Types.ObjectId;
	items: ICartItems[];
}

const CartSchema = new Schema<ICart>({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true,
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
		},
	],
});

const Cart = model<ICart>("Cart", CartSchema);
export default Cart;