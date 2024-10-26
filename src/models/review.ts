import { Document, Schema, model } from "mongoose";

export interface IReview extends Document {
	rating: number;
	comment: string;
	user: Schema.Types.ObjectId;
	book: Schema.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;

	_id: Schema.Types.ObjectId;
}

const ReviewSchema = new Schema<IReview>(
	{
		rating: {
			type: Number,
			required: true,
		},
		comment: {
			type: String,
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		book: {
			type: Schema.Types.ObjectId,
			ref: "Book",
		},
	},
	{
		timestamps: true,
	}
);

const Review = model<IReview>("Review", ReviewSchema);
export default Review;
