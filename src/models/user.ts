import { Document, model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

enum UserType {
	ADMIN = "admin",
	USER = "user",
}

export interface IUser extends Document {
	email: string;
	password: string;
	name: string;
	role: UserType;
	cart: Schema.Types.ObjectId;
	orders: Schema.Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;

	isPasswordCorrect(password: string): Promise<boolean>;
	generateToken(): string;
	isAdmin(): boolean;
}

const UserSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: Object.values(UserType),
			default: UserType.USER,
		},
		cart: {
			type: Schema.Types.ObjectId,
			ref: "Cart",
		},
		orders: [
			{
				type: Schema.Types.ObjectId,
				ref: "Order",
			},
		],
	},
	{
		timestamps: true,
	}
);

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}

	const hashedPassword = await bcrypt.hash(this.password, 10);
	this.password = hashedPassword;
	next();
});

UserSchema.methods.isPasswordCorrect = async function (password: string) {
	return await bcrypt.compare(password, this.password);
};

UserSchema.method("isAdmin", function () {
	return this.role === UserType.ADMIN;
});

UserSchema.methods.generateToken = function () {
	const token = jwt.sign(
		{
			_id: this._id,
			email: this.email,
		},
		process.env.JWT_SECRET as string,
		{
			expiresIn: "7d",
		}
	);
	return token;
};

const User = model<IUser>("User", UserSchema);
export default User;
