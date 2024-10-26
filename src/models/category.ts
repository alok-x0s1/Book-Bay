import { Document, model, Schema } from "mongoose";

export interface ICategory extends Document {
	name: string;
	books: Schema.Types.ObjectId[];
}

const CategorySchema = new Schema<ICategory>({
	name: {
		type: String,
		required: true,
	},
	books: [
		{
			type: Schema.Types.ObjectId,
			ref: "Book",
		},
	],
});

const Category = model<ICategory>("Category", CategorySchema);
export default Category;
