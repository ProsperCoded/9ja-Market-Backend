import { Router } from "express";
import { MarketerController } from "./marketer.controller";
import { MarketerService } from "./marketer.service";
import { MarketerRepository } from "../repositories/marketer.repository";
import { MarketerEarningsRepository } from "../repositories/marketer-earnings.repository";
import { AdRepository } from "../repositories/ad.repository";
import { WinstonLogger } from "../utils/logger/winston.logger";
import { Validator } from "../utils/middlewares/validator.middleware";
import { IdDto } from "../dtos/id.dto";
import { MarketerCreateDto } from "./dtos/marketer-create.dto";
import { MarketerUpdateDto } from "./dtos/marketer-update.dto";
import { MulterMiddleware } from "../utils/middlewares/file-parser.middleware";
import { CustomerAuthGaurd } from "../utils/middlewares/guards/customer.auth.guard";
import { Role } from "@prisma/client";
import { CustomerRepository } from "../repositories/customer.repository";
import { JWTService } from "../utils/jwt/jwt.service";

const router = Router();
export const marketerRepository = new MarketerRepository();
const customerRepository = new CustomerRepository();
export const marketerEarningsRepository = new MarketerEarningsRepository();
const adRepository = new AdRepository();
const logger = new WinstonLogger("MarketerService");
export const marketerService = new MarketerService(
  marketerRepository,
  customerRepository,
  marketerEarningsRepository,
  adRepository,
  logger
);
const marketerController = new MarketerController(marketerService);
const validator = new Validator();
const fileParser = new MulterMiddleware(logger);
const jwtService = new JWTService();
const customerAuthGuard = new CustomerAuthGaurd(
  customerRepository,
  logger,
  jwtService
);

// Public routes
router.get(
  "/referrer/:referrerCode",
  marketerController.getMarketerByReferrerCode
);

// Admin only routes
router.get(
  "/",
  customerAuthGuard.authorise({ strict: true, role: Role.ADMIN }),
  marketerController.getAllMarketers
);

// New route to get all marketers with their earnings
router.get(
  "/earnings",
  customerAuthGuard.authorise({ strict: true, role: Role.ADMIN }),
  marketerController.getAllMarketersWithEarnings
);

router.get(
  "/:marketerId",
  customerAuthGuard.authorise({ strict: true }),
  validator.single(IdDto, "params"),
  marketerController.getMarketerById
);

router.get(
  "/:marketerId/earnings",
  customerAuthGuard.authorise({ strict: true }),
  validator.single(IdDto, "params"),
  marketerController.getMarketerEarnings
);

// New routes for marketer earnings
router.get(
  "/:marketerId/earnings-paid",
  customerAuthGuard.authorise({ strict: true }),
  validator.single(IdDto, "params"),
  marketerController.getMarketerPaidEarnings
);

router.get(
  "/:marketerId/earnings-unpaid",
  customerAuthGuard.authorise({ strict: true }),
  validator.single(IdDto, "params"),
  marketerController.getMarketerUnpaidEarnings
);

router.post(
  "/:marketerId/payment-made",
  customerAuthGuard.authorise({ strict: true, role: Role.ADMIN }),
  validator.single(IdDto, "params"),
  marketerController.markEarningsAsPaid
);

router.post(
  "/",
  fileParser.single("IdentityCredentialImage"),
  validator.single(MarketerCreateDto, "body"),
  marketerController.createMarketer
);

router.put(
  "/:marketerId",
  customerAuthGuard.authorise({ strict: true }),
  fileParser.single("IdentityCredentialImage"),
  validator.multiple([
    { schema: IdDto, source: "params" },
    { schema: MarketerUpdateDto, source: "body" },
  ]),
  marketerController.updateMarketer
);

router.put(
  "/:marketerId/verify",
  customerAuthGuard.authorise({ strict: true, role: Role.ADMIN }),
  validator.single(IdDto, "params"),
  marketerController.verifyMarketer
);

router.delete(
  "/:marketerId",
  customerAuthGuard.authorise({ strict: true, role: Role.ADMIN }),
  validator.single(IdDto, "params"),
  marketerController.deleteMarketer
);

export default router;
