import { Router } from "express";
import { HomeController } from "./home/home.controller";

import AuthRouter from './auth/auth.routes';
import CustomerRouter from './customer/customer.routes';
import ProductRouter from './product/product.routes';

const router = Router();

// Home Route
const home = new HomeController();
router.get("/", home.index);

// Authentication Module
router.use('/auth', AuthRouter);

// Customer Module
router.use('/customer', CustomerRouter);

// Product Module
router.use('/product', ProductRouter);


export default router;