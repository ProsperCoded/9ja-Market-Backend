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

const router = Router();
const addressRepository = new AddressRepository();
const phoneNumberRepository = new PhoneNumberRepository();
const merchantRepository = new MerchantRepository();
const logger = new WinstonLogger("MerchantService");
const jwtService = new JWTService();
const merchantService = new MerchantService(merchantRepository, addressRepository, phoneNumberRepository, logger);
const merchantController = new MerchantController(merchantService);
const validator = new Validator();
const merchantAuthGaurd = new MerchantAuthGaurd(merchantRepository, logger, jwtService);


router.get("/:merchantId", merchantAuthGaurd.authorise({ id: true }), validator.single(IdDto, "params"), merchantController.getMerchantById);

router.put("/:merchantId", merchantAuthGaurd.authorise({ id: true }), validator.multiple([
    { schema: IdDto, source: "params" },
    { schema: MerchantUpdateDto, source: "body" }
]), merchantController.updateMerchant);

router.delete("/:merchantId", merchantAuthGaurd.authorise({ id: true }), validator.single(IdDto, "params"), merchantController.deleteMerchant);


export default router;