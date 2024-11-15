import { Document, model, Schema } from "mongoose";

export interface IBook extends Document {
    _id: Schema.Types.ObjectId;
    title: string;
    author: string;
    description: string;
    price: number;
    stock: number;
    ratings: number;
    coverImage: string;
    file: string;
    category: Schema.Types.ObjectId;
    reviews: Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
    {
        title: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        ratings: {
            type: Number,
            default: 0
        },
        coverImage: {
            type: String,
            required: true
        },
        file: {
            type: String,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category"
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review"
            }
        ]
    },
    {
        timestamps: true
    }
);

const Book = model<IBook>("Book", BookSchema);
export default Book;
