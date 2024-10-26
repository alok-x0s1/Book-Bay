import { Document, model, Schema } from "mongoose";

export interface IBook extends Document {
	title: string;
	author: string;
	description: string;
	price: number;
	stock: number;
	ratings: number;
	category: Schema.Types.ObjectId;
	reviews: Schema.Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;

	_id: Schema.Types.ObjectId;
}

const BookSchema = new Schema<IBook>(
	{
		title: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		stock: {
			type: Number,
			required: true,
		},
		ratings: {
			type: Number,
			default: 0,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: "Category",
		},
		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: "Review",
			},
		],
	},
	{
		timestamps: true,
	}
);

const Book = model<IBook>("Book", BookSchema);
export default Book;
