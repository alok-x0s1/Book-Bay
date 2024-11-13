import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/response";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { config } from "../config/config";

interface JwtPayload {
    _id: string;
    email: string;
}

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token =
            req.cookies.token ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            errorResponse(res, "Access denied, no token provided", 401);
            return;
        }

        const decoded = jwt.verify(token, config.jwt_secret) as JwtPayload;

        const existingUser = await User.findById(decoded._id);

        if (!existingUser) {
            errorResponse(res, "User not found", 404);
            return;
        }

        const user = {
            _id: existingUser._id as string,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role
        };

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        errorResponse(res, "Something went wrong", 500);
    }
};

export default isLoggedIn;
