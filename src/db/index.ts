import mongoose from "mongoose";
import { config } from "../config/config";

export const dbConnect = async () => {
	try {
		const connection = await mongoose.connect(config.dbUri);
		console.log(
			"Successfully connected to MongoDB => ",
			connection.connection.host
		);
	} catch (error) {
		console.log("MongoDB connection error.");
		process.exit(1);
	}
};
