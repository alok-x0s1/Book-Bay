import "dotenv/config";
import { dbConnect } from "./db";
import app from "./app";

const PORT = process.env.PORT || 8000;

dbConnect()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("Error connecting to the database: ", error);
		process.exit(1);
	});
