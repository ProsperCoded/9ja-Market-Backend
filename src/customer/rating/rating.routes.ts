import { Router } from "express";
import { WinstonLogger } from "../../utils/logger/winston.logger";
import { JWTService } from "../../utils/jwt/jwt.service";
import { CustomerRepository } from "../../repositories/customer.repository";
import { AddressRepository } from "../../repositories/address.repository";
import { PhoneNumberRepository } from "../../repositories/phone-number.repository";
import { CustomerService } from "../customer.service";
import { CustomerAuthGaurd } from "../../utils/middlewares/guards/customer.auth.guard";
import { Validator } from "../../utils/middlewares/validator.middleware";
import { RatingController } from "./rating.controller";
import { RatingService } from "./rating.service";
import { RatingRepository } from "../../repositories/rating.repository";
import { IdDto } from "../../dtos/id.dto";
import { RatingUpdateDto } from "../dtos/rating-update.dto";
import { RatingCreateDto } from "../dtos/rating-create.dto";

const router = Router();

const logger = new WinstonLogger("RatingService");
const jwtService = new JWTService();
const ratingRepository = new RatingRepository();
const customerRepository = new CustomerRepository();
const addressRepository = new AddressRepository();
const phoneNumberRepository = new PhoneNumberRepository();
const customerService = new CustomerService(customerRepository, addressRepository, phoneNumberRepository, logger);
const ratingService = new RatingService(ratingRepository, logger);
const ratingController = new RatingController(ratingService)
const validator = new Validator("RatingService");
const customerAuthGaurd = new CustomerAuthGaurd(customerService, logger, jwtService)



// Get Ratings for a Product
router.get("/:productId", customerAuthGaurd.authorise(), validator.single(IdDto, "params"), ratingController.getRatings);

// Create Rating
router.post("/:productId", customerAuthGaurd.authorise(), validator.multiple([
    { schema: IdDto, source: "params" },
    { schema: RatingCreateDto, source: "body" }
]), ratingController.createRating);

// Update Rating
router.put("/:productId", customerAuthGaurd.authorise(), validator.multiple([
    { schema: IdDto, source: "params" },
    { schema: RatingUpdateDto, source: "body" }
]), ratingController.updateRating);

// Delete Rating
router.delete("/:productId", customerAuthGaurd.authorise(), validator.single(IdDto, "params"), ratingController.deleteRating);

export default router;