import { Router } from "express";
import isLoggedIn from "../middleware/auth";
import { createPayment, getPayementDetails } from "../controllers/payment";

const router = Router();

router.post("/create-intent", isLoggedIn, createPayment);
router.get("/details/:id", isLoggedIn, getPayementDetails);

export default router;
