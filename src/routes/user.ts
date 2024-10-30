import { Router } from "express";
import {
	logout,
	signin,
	signup,
	updateInfo,
	updatePassword,
} from "../controllers/user";
import isLoggedIn from "../middleware/auth";

const router = Router();

router.route("/sign-up").post(signup);
router.route("/sign-in").post(signin);
router.route("/logout").get(logout);
router.route("/update-info").patch(isLoggedIn, updateInfo);
router.route("/update-password").patch(isLoggedIn, updatePassword);

export default router;
