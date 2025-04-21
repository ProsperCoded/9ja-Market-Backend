import { Router } from "express";
import { MarketController } from "./market.controller";
import { MarketService } from "./market.service";
import { MarketRepository } from "../repositories/market.repository";
import { WinstonLogger } from "../utils/logger/winston.logger";
import { Validator } from "../utils/middlewares/validator.middleware";
import { IdDto } from "../dtos/id.dto";
import { MarketUpdateDto } from "./dtos/market-update.dto";
import { MarketCreateDto } from "./dtos/market-create.dto";
import { GetByNameDto } from "./dtos/get-by-name.dto";
import { MulterMiddleware } from "../utils/middlewares/file-parser.middleware";
import { httpCacheDuration } from "../utils/middlewares/httpCache.middleware";
import { CustomerRepository } from "../repositories/customer.repository";
import { CustomerAuthGaurd } from "../utils/middlewares/guards/customer.auth.guard";
import { Role } from "@prisma/client";
import { JWTService } from "../utils/jwt/jwt.service";
const router = Router();
const marketRepository = new MarketRepository();
const logger = new WinstonLogger("MarketService");
const marketService = new MarketService(marketRepository, logger);
const marketController = new MarketController(marketService);
const validator = new Validator();
const fileParser = new MulterMiddleware(logger);
const customerRepository = new CustomerRepository();
const jwtService = new JWTService();
const customerAuthGuard = new CustomerAuthGaurd(
  customerRepository,
  logger,
  jwtService
);

router.get("/names", marketController.getMarketNames);

router.get("/", httpCacheDuration(3600), marketController.getAllMarkets);

router.get("/malls", httpCacheDuration(3600), marketController.getAllMalls);

router.get(
  "/",
  validator.single(GetByNameDto, "body"),
  marketController.getMarketByName
);

router.get(
  "/:marketId",
  httpCacheDuration(3600 * 24),
  validator.single(IdDto, "params"),
  marketController.getMarketById
);

router.post(
  "/",
  fileParser.single("displayImage"),
  validator.single(MarketCreateDto, "body"),
  marketController.createMarket
);

router.put(
  "/:marketId",
  customerAuthGuard.authorise({ strict: true, role: Role.ADMIN }),
  fileParser.single("displayImage"),
  validator.multiple([
    { schema: IdDto, source: "params" },
    { schema: MarketUpdateDto, source: "body" },
  ]),
  marketController.updateMarket
);

router.delete(
  "/:marketId",
  customerAuthGuard.authorise({ strict: true, role: Role.ADMIN }),
  validator.single(IdDto, "params"),
  marketController.deleteMarket
);

router.delete(
  "/",
  customerAuthGuard.authorise({ strict: true, role: Role.ADMIN }),
  marketController.deleteAllMarkets
);

export default router;
