import "dotenv/config";
import { dbConnect } from "./db";
import app from "./app";

process.on("uncaughtException", (err) => {
	console.error("Uncaught Exception:", err);
	console.error("Node process will now exit...");
	process.exit(1);
});

const PORT = process.env.PORT || 3000;

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

process.on("unhandledRejection", (err: any) => {
	console.log(`Unhandled rejection: ${err.message}`);
	console.log("Shutting down the server due to: " + err.message);

	process.exit(1);
});
