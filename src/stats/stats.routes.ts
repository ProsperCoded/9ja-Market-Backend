import { Router } from "express";
import { StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";
import { CustomerRepository } from "../repositories/customer.repository";
import { MerchantRepository } from "../repositories/merchant.repository";
import { TransactionRepository } from "../repositories/transaction.repository";
import { WinstonLogger } from "../utils/logger/winston.logger";
import { CustomerAuthGaurd } from "../utils/middlewares/guards/customer.auth.guard";
import { Role } from "@prisma/client";
import { JWTService } from "../utils/jwt/jwt.service";

const router = Router();

const customerRepository = new CustomerRepository();
const merchantRepository = new MerchantRepository();
const transactionRepository = new TransactionRepository();
const logger = new WinstonLogger("StatsService");
const jwtService = new JWTService();

const statsService = new StatsService(
  customerRepository,
  merchantRepository,
  transactionRepository,
  logger
);
const statsController = new StatsController(statsService);

const customerAuthGuard = new CustomerAuthGaurd(
  customerRepository,
  logger,
  jwtService
);

// Basic platform stats (customers and merchants count)
router.get(
  "/platform",
  customerAuthGuard.authorise({ strict: true, role: Role.ADMIN }),
  statsController.getPlatformStats
);

// Get revenue stats
router.get(
  "/revenue",
  customerAuthGuard.authorise({ strict: true, role: Role.ADMIN }),
  statsController.getAdRevenue
);

// Get all stats
router.get(
  "/all",
  customerAuthGuard.authorise({ strict: true, role: Role.ADMIN }),
  statsController.getAllStats
);

export default router;
