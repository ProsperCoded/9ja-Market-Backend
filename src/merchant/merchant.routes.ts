import { Router } from "express";
import { MerchantController } from "./merchant.controller";
import { MerchantService } from "./merchant.service";
import { MerchantRepository } from "../repositories/merchant.repository";
import { AddressRepository } from "../repositories/address.repository";
import { PhoneNumberRepository } from "../repositories/phone-number.repository";
import { WinstonLogger } from "../utils/logger/winston.logger";
import { Validator } from "../utils/middlewares/validator.middleware";
import { MerchantAuthGaurd } from "../utils/middlewares/guards/merchant.auth.guard";
import { JWTService } from "../utils/jwt/jwt.service";
import { IdDto } from "../dtos/id.dto";
import { MerchantUpdateDto } from "./dtos/merchant-update.dto";
import { MarketRepository } from "../repositories/market.repository";
import { MarketerRepository } from "../repositories/marketer.repository";
import { MerchantReferrerDto } from "./dtos/merchant-referrer.dto";

const router = Router();
const addressRepository = new AddressRepository();
const phoneNumberRepository = new PhoneNumberRepository();
const merchantRepository = new MerchantRepository();
const marketRepository = new MarketRepository();
const marketerRepository = new MarketerRepository();
const logger = new WinstonLogger("MerchantService");
const jwtService = new JWTService();
const merchantService = new MerchantService(
  merchantRepository,
  marketRepository,
  addressRepository,
  phoneNumberRepository,
  marketerRepository,
  logger
);
const merchantController = new MerchantController(merchantService);
const validator = new Validator();
const merchantAuthGaurd = new MerchantAuthGaurd(
  merchantRepository,
  logger,
  jwtService
);

router.get(
  "/:merchantId",
  validator.single(IdDto, "params"),
  merchantController.getMerchantById
);

router.get(
  "/market/:marketId",
  validator.single(IdDto, "params"),
  merchantController.getMerchantsByMarket
);

router.put(
  "/:merchantId",
  validator.multiple([
    { schema: IdDto, source: "params" },
    { schema: MerchantUpdateDto, source: "body" },
  ]),
  merchantAuthGaurd.authorise({ id: true }),
  merchantController.updateMerchant
);

router.delete(
  "/:merchantId",
  merchantAuthGaurd.authorise({ id: true }),
  validator.single(IdDto, "params"),
  merchantController.deleteMerchant
);

// // Add referrer code to merchant
// router.post(
//   "/:merchantId/referrer",
//   merchantAuthGaurd.authorise(),
//   validator.multiple([
//     { schema: IdDto, source: "params" },
//     { schema: MerchantReferrerDto, source: "body" },
//   ]),
//   merchantController.connectToMarketer
// );

export default router;
