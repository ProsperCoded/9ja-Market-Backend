import { Router } from "express";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";
import { CustomerRepository } from "../repositories/customer.repository";
import { AddressRepository } from "../repositories/address.repository";
import { PhoneNumberRepository } from "../repositories/phone-number.repository";
import { WinstonLogger } from "../utils/logger/winston.logger";


import CartRouter from "./cart/cart.routes";
import RatingRouter from "./rating/rating.routes";
import { Validator } from "../utils/middlewares/validator.middleware";
import { IdDto } from "../dtos/id.dto";


// Customer Service Dependents
const customerRepository = new CustomerRepository();
const addressRepository = new AddressRepository();
const phoneNumberRepository = new PhoneNumberRepository();
const logger = new WinstonLogger("CustomerService");

const customerService = new CustomerService(customerRepository, addressRepository, phoneNumberRepository, logger);
const customerController = new CustomerController(customerService);

const validator = new Validator("CustomerService");

const router = Router()

// Add the CartRouter to the customer router
router.use("/cart", CartRouter);

// Add the RatingRouter to the customer router
router.use("/rating", RatingRouter);

// Customer Routes
router.get("/profile/:id", validator.single(IdDto, "params"), customerController.getCustomerById);

router.put("/profile/:id", validator.single(IdDto, "params"), customerController.updateCustomer);

router.delete("/profile/:id", validator.single(IdDto, "params"), customerController.deleteCustomer);

export default router;