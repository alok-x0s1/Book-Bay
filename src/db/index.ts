import mongoose from "mongoose";

export const dbConnect = async () => {
	try {
		const url = process.env.DATABASE_URL as string;
		const connection = await mongoose.connect(url);
		console.log(
			"Successfully connected to MongoDB => ",
			connection.connection.host
		);
	} catch (error) {
		console.log("MongoDB connection error.");
		process.exit(1);
	}
};
