import { Response } from "express";

export const errorResponse = (
	res: Response,
	message: string,
	errorCode: number = 500,
	errorDetails?: any
) => {
	return res.status(errorCode).json({
		success: false,
		message,
		errorCode,
		...(errorDetails && { errorDetails }),
	});
};

export const successResponse = (
	res: Response,
	message: string,
	data: any = {},
	statusCode: number = 200
) => {
	return res.status(statusCode).json({
		success: true,
		message,
		statusCode,
		data,
	});
};
