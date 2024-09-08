import { Router } from "express";

import CustomerAuthRouter from './customer/customer.auth.routes';
import MarketAuthRouter from './market/market.auth.routes';

const router = Router();

// Customer Authentication Routes
router.use('/customer', CustomerAuthRouter);

// Market Authentication Routes
router.use('/market', MarketAuthRouter);


export default router;