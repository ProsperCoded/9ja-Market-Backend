import { Router } from "express";
import { AdService } from "./ad.service";
import { AdRepository } from "../repositories/ad.repository";
import { PaystackPaymentRepository } from "../repositories/payment.repository";
import { ProductRepository } from "../repositories/product.repository";
import { TransactionRepository } from "../repositories/transaction.repository";
import { WinstonLogger } from "../utils/logger/winston.logger";
import { AdController } from "./ad.controller";
import { Validator } from "../utils/middlewares/validator.middleware";
import { MerchantAuthGaurd } from "../utils/middlewares/guards/merchant.auth.guard";
import { MerchantRepository } from "../repositories/merchant.repository";
import { JWTService } from "../utils/jwt/jwt.service";
import { InitializeAdPaymentDto } from "./dtos/initialize-ad-payment.dto";
import { IdDto } from "./dtos/Id.dto";
import { ProductIdDto } from "./dtos/productId.dto";
import { CustomerAuthGaurd } from "../utils/middlewares/guards/customer.auth.guard";
import { CustomerRepository } from "../repositories/customer.repository";
import { Role } from "@prisma/client";
const router = Router();

const merchantRepository = new MerchantRepository();
const customerRepository = new CustomerRepository();
const jwtService = new JWTService();
const adRepository = new AdRepository();
const paymentService = new PaystackPaymentRepository();
const productRepository = new ProductRepository();
const transactionRepository = new TransactionRepository();

const logger = new WinstonLogger("AdService");
const adService = new AdService(
  adRepository,
  paymentService,
  productRepository,
  transactionRepository,
  logger
);
const adController = new AdController(adService);

const validator = new Validator();
const customerAuthGuard = new CustomerAuthGaurd(
  customerRepository,
  logger,
  jwtService
);
const merchantAuthGaurd = new MerchantAuthGaurd(
  merchantRepository,
  logger,
  jwtService
);

// Activate Free Ad
router.post(
  "/free/:productId",
  merchantAuthGaurd.authorise({ strict: true }),
  adController.activateFreeAd
);

// Initialize Ad Payment
router.post(
  "/initialize/:level/:productId",
  validator.single(InitializeAdPaymentDto, "params"),
  merchantAuthGaurd.authorise({ strict: true }),
  adController.initializeAdPayment
);

// Verify Ad Payment
router.get(
  "/verify/:reference",
  merchantAuthGaurd.authorise({ strict: true }),
  adController.verifyAdPayment
);

// Get Ads (with optional filters)
router.get("/all", adController.getAllFilteredAds);

// * filters out ads that have expired and not paid for
router.get("/", adController.getFilteredAds);
router.get("/:adId", validator.single(IdDto, "params"), adController.getAd);
router.get(
  "/product/:productId",
  validator.single(ProductIdDto, "params"),
  adController.getAdByProduct
);
// Track Ad Click
router.put(
  "/:adId/click",
  validator.single(IdDto, "params"),
  adController.trackAdClick
);
// Track Ad View
router.put(
  "/:adId/view",
  validator.single(IdDto, "params"),
  adController.trackAdView
);

export default router;
