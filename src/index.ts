import "dotenv/config";
import { dbConnect } from "./db";
import app from "./app";
import { config } from "./config/config";

const PORT = config.port;

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
