import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import { categorySchema, updateCategorySchema } from "../schema/category";
import Category from "../models/category";
import mongoose from "mongoose";

const createCategory = async (req: Request, res: Response) => {
    try {
        const validData = categorySchema.safeParse(req.body);

        if (!validData.success) {
            errorResponse(res, "Invalid data", 400, validData.error);
            return;
        }
        const { name } = validData.data;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            errorResponse(res, "Category already exists", 400);
            return;
        }

        const newCategory = await Category.create({
            name
        });

        successResponse(res, "Category created successfully", newCategory, 201);
    } catch (error) {
        console.log(error);
        errorResponse(res, "Something went wrong", 500, error);
    }
};

const updatedCategory = async (req: Request, res: Response) => {
    try {
        const validData = updateCategorySchema.safeParse(req.body);
        if (!validData.success) {
            errorResponse(res, "Invalid data", 400, validData.error);
            return;
        }
        const { name } = validData.data;
        const { id } = req.params;

        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) {
            errorResponse(res, "Invalid category id", 400);
            return;
        }

        const existingCategory = await Category.findOne({ _id: id });
        if (!existingCategory) {
            errorResponse(res, "Category not found", 404);
            return;
        }
        existingCategory.name = name;
        await existingCategory.save();
        successResponse(
            res,
            "Category updated successfully",
            existingCategory,
            200
        );
    } catch (error) {
        console.log(error);
        errorResponse(res, "Something went wrong", 500, error);
    }
};

const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find().select("-books");
        successResponse(
            res,
            "Categories fetched successfully",
            categories,
            200
        );
    } catch (error) {
        console.log(error);
        errorResponse(res, "Something went wrong", 500, error);
    }
};

const getBooksByCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.query;
        if (!name) {
            errorResponse(res, "Name is required", 400);
            return;
        }

        const category = await Category.findOne({ name }).populate("books");

        console.log(category);
        if (!category) {
            errorResponse(res, "Category not found", 404);
            return;
        }

        if (category.books.length === 0) {
            errorResponse(res, "No books found in this category", 404);
            return;
        }

        const books = category.books;
        successResponse(res, "Books fetched successfully", books, 200);
    } catch (error) {
        console.log(error);
        errorResponse(res, "Something went wrong", 500, error);
    }
};

const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) {
            errorResponse(res, "Invalid category id", 400);
            return;
        }

        const category = await Category.findById(id);
        if (!category) {
            errorResponse(res, "Category not found", 404);
        }

        if (category?.books && category.books.length > 0) {
            errorResponse(res, "Cannot delete category with books", 400);
            return;
        }

        await Category.findByIdAndDelete(id);
        successResponse(res, "Category deleted successfully", {}, 200);
    } catch (error) {
        console.log(error);
        errorResponse(res, "Something went wrong", 500, error);
    }
};

export {
    createCategory,
    updatedCategory,
    getAllCategories,
    getBooksByCategory,
	deleteCategory
};
