import { Router } from "express";
import { HomeController } from "./home/home.controller";

import AuthRouter from './auth/auth.routes';

const router = Router();

// Home Route
const home = new HomeController();
router.get("/", home.index);

// Authentication Module
router.use('/auth', AuthRouter);


export default router;