import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.user;
		if (!user) {
			errorResponse(res, "Unauthorized request", 404);

			return;
		}

		if (user.role !== "admin") {
			errorResponse(res, "Forbidden request", 404);

			return;
		}
		next();
	} catch (error) {
		console.error(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

export default isAdmin;
