import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app: Express = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user";
import bookRouter from "./routes/book";
import cartRouter from "./routes/cart";
import orderRouter from "./routes/order";
import paymentRouter from "./routes/payment";
import reviewRouter from "./routes/review";
import categoryRouter from "./routes/category";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/categories", categoryRouter);

export default app;
