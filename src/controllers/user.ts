import { Request, Response } from "express";
import {
	signinSchema,
	signupSchema,
	updateInfoSchema,
	updatePasswordSchema,
} from "../schema/user";
import { errorResponse, successResponse } from "../utils/response";
import User from "../models/user";
import { cookieOptions } from "../utils/cookie";

const signup = async (req: Request, res: Response) => {
	try {
		const validData = signupSchema.safeParse(req.body);
		if (!validData.success) {
			errorResponse(
				res,
				validData.error.message,
				400,
				validData.error.errors
			);

			return;
		}

		const { name, email, password } = validData.data;
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			errorResponse(res, "User already exists", 400);

			return;
		}

		const newUser = await User.create({
			name,
			email,
			password,
		});

		const token = newUser.generateToken();
		const user = {
			_id: newUser._id,
			name: newUser.name,
			email: newUser.email,
			role: newUser.role,
		};

		res.cookie("token", token, cookieOptions);
		successResponse(res, "User created successfully", { user, token }, 201);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

const signin = async (req: Request, res: Response) => {
	try {
		const validData = signinSchema.safeParse(req.body);
		if (!validData.success) {
			errorResponse(
				res,
				validData.error.message,
				400,
				validData.error.errors
			);

			return;
		}

		const { email, password } = validData.data;
		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			errorResponse(res, "User does not exist", 400);
			return;
		}

		const isPasswordCorrect = await existingUser.isPasswordCorrect(
			password
		);

		if (!isPasswordCorrect) {
			errorResponse(res, "Invalid credentials", 400);
			return;
		}

		const token = existingUser.generateToken();
		const user = {
			_id: existingUser._id,
			name: existingUser.name,
			email: existingUser.email,
			role: existingUser.role,
		};

		res.cookie("token", token, cookieOptions);
		successResponse(
			res,
			"User logged in successfully",
			{ user, token },
			200
		);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

const logout = async (req: Request, res: Response) => {
	try {
		res.clearCookie("token");
		successResponse(res, "User logged out successfully", {}, 200);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

const updateInfo = async (req: Request, res: Response) => {
	try {
		const validData = updateInfoSchema.safeParse(req.body);
		if (!validData.success) {
			errorResponse(
				res,
				validData.error.message,
				400,
				validData.error.errors
			);

			return;
		}

		const { name } = validData.data;
		const existingUser = await User.findByIdAndUpdate(
			req.user?._id,
			{ name },
			{ new: true }
		);
		if (!existingUser) {
			errorResponse(res, "User not found", 404);

			return;
		}

		successResponse(res, "User info updated successfully", {}, 200);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

const updatePassword = async (req: Request, res: Response) => {
	try {
		const validData = updatePasswordSchema.safeParse(req.body);
		if (!validData.success) {
			errorResponse(
				res,
				validData.error.message,
				400,
				validData.error.errors
			);

			return;
		}

		const { currentPassword, newPassword } = validData.data;
		if(newPassword === currentPassword) {
			errorResponse(res, "New password cannot be same as current password", 400);
			return
		}
		const existingUser = await User.findById(req.user?._id);
		if (!existingUser) {
			errorResponse(res, "User not found", 404);

			return;
		}

		const isPasswordCorrect = await existingUser.isPasswordCorrect(
			currentPassword
		);
		if (!isPasswordCorrect) {
			errorResponse(res, "Invalid credentials", 400);
			return;
		}

		existingUser.password = newPassword;
		await existingUser.save();

		successResponse(res, "Password updated successfully", {}, 200);
	} catch (error) {
		console.log(error);
		errorResponse(res, "Something went wrong", 500, error);
	}
};

export { signup, signin, logout, updateInfo, updatePassword };
