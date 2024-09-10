import { Router } from "express";
import { CartService } from "./cart.service";
import { ProductService } from "../../product/product.service";
import { ProductRepository } from "../../repositories/product.repository";
import { CartProductRepository } from "../../repositories/cart-product.repository";
import { WinstonLogger } from "../../utils/logger/winston.logger";
import { CartController } from "./cart.controller";
import { Validator } from "../../utils/middlewares/validator.middleware";
import { CustomerAuthGaurd } from "../../utils/middlewares/guards/customer.auth.guard";
import { JWTService } from "../../utils/jwt/jwt.service";
import { CustomerService } from "../customer.service";
import { CustomerRepository } from "../../repositories/customer.repository";
import { AddressRepository } from "../../repositories/address.repository";
import { PhoneNumberRepository } from "../../repositories/phone-number.repository";
import { IdDto } from "../../dtos/id.dto";
import { AddToCartDto } from "../dtos/add-to-cart.dto";

const router = Router();
const logger = new WinstonLogger("CartService");
const jwtService = new JWTService();
const cartProductRepository = new CartProductRepository();
const productRepository = new ProductRepository();
const customerRepository = new CustomerRepository();
const addressRepository = new AddressRepository();
const phoneNumberRepository = new PhoneNumberRepository();
const customerService = new CustomerService(customerRepository, addressRepository, phoneNumberRepository, logger);
const productService = new ProductService(productRepository, logger);
const cartService = new CartService(cartProductRepository, productService, logger);
const cartController = new CartController(cartService)
const validator = new Validator("CartService");
const customerAuthGaurd = new CustomerAuthGaurd(customerService, logger, jwtService)


// Get Cart by Customer Id
router.get("/:id", customerAuthGaurd.authorise(), validator.single(IdDto, "params"), cartController.getCart);

// Update Cart
router.put("/:productId", customerAuthGaurd.authorise(), validator.multiple([
    { schema: IdDto, source: "params" },
    { schema: AddToCartDto, source: "body" }
]), cartController.updateCart);

// Clear Cart
router.delete("/clear", customerAuthGaurd.authorise(), cartController.removeAllFromCart);

// Remove product from Cart
router.delete("/:productId", customerAuthGaurd.authorise(), validator.single(IdDto, "params"), cartController.removeFromCart);


export default router;