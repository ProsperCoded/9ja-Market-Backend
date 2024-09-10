import { Router } from "express";


import CartRouter from "./cart/cart.routes";
import RatingRouter from "./rating/rating.routes";

const router = Router()

// Add the CartRouter to the customer router
router.use("/cart", CartRouter);

// Add the RatingRouter to the customer router
router.use("/rating", RatingRouter);

export default router;