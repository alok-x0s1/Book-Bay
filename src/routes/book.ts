import { Router } from "express";
import {
    createBook,
    deleteBook,
    getBooks,
    getSingleBook,
    updateBook
} from "../controllers/book";
import isLoggedIn from "../middleware/auth";
import isAdmin from "../middleware/admin";
import upload from "../middleware/multer";

const router = Router();

router.route("/").get(getBooks);
router.route("/:id").get(getSingleBook);

router.route("/").post(
    isLoggedIn,
    isAdmin,
    upload.fields([
        { name: "file", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    createBook
);
router
    .route("/:id")
    .patch(isLoggedIn, isAdmin, updateBook)
    .delete(isLoggedIn, isAdmin, deleteBook);

export default router;
