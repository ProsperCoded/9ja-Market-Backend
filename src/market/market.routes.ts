import { Router } from "express";
import { MarketController } from "./market.controller";
import { MarketService } from "./market.service";
import { MarketRepository } from "../repositories/market.repository";
import { AddressRepository } from "../repositories/address.repository";
import { PhoneNumberRepository } from "../repositories/phone-number.repository";
import { WinstonLogger } from "../utils/logger/winston.logger";
import { Validator } from "../utils/middlewares/validator.middleware";
import { MarketAuthGaurd } from "../utils/middlewares/guards/market.auth.guard";
import { JWTService } from "../utils/jwt/jwt.service";
import { IdDto } from "../dtos/id.dto";
import { MarketUpdateDto } from "./dtos/market-update.dto";

const router = Router();
const addressRepository = new AddressRepository();
const phoneNumberRepository = new PhoneNumberRepository();
const marketRepository = new MarketRepository();
const logger = new WinstonLogger("MarketService");
const jwtService = new JWTService();
const marketService = new MarketService(marketRepository, addressRepository, phoneNumberRepository, logger);
const marketController = new MarketController(marketService);
const validator = new Validator("MarketService");
const marketAuthGaurd = new MarketAuthGaurd(marketService, logger, jwtService);


router.get("/:marketId", marketAuthGaurd.authorise({ id: true }), validator.single(IdDto, "params"), marketController.getMarketById);

router.put("/:marketId", marketAuthGaurd.authorise({ id: true }), validator.multiple([
    { schema: IdDto, source: "params" },
    { schema: MarketUpdateDto, source: "body" }
]), marketController.updateMarket);

router.delete("/:marketId", marketAuthGaurd.authorise({ id: true }), validator.single(IdDto, "params"), marketController.deleteMarket);


export default router;