import { Router } from "express";
import { WinstonLogger } from "../utils/logger/winston.logger";
import { ProductRepository } from "../repositories/product.repository";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { Validator } from "../utils/middlewares/validator.middleware";
import { IdDto } from "../dtos/id.dto";
import { ProductUpdateDto } from "./dtos/product-update.dto";
import { MarketAuthGaurd } from "../utils/middlewares/guards/market.auth.guard";
import { JWTService } from "../utils/jwt/jwt.service";
import { MarketRepository } from "../repositories/market.repository";
import { ProductCreateDto } from "./dtos/product-create.dto";

const logger = new WinstonLogger("ProductService");
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository, logger);
const productController = new ProductController(productService);
const jwtService = new JWTService();
const marketRepository = new MarketRepository();
const marketAuthGaurd = new MarketAuthGaurd(marketRepository, logger, jwtService);

const validator = new Validator();

const router = Router();


// Get Product by Id
router.get("/:id", validator.single(IdDto, "params"), productController.getProductById);

// Create a Product
router.post("/", marketAuthGaurd.authorise(), validator.single(ProductCreateDto, "body"), productController.createProduct);

// Update Product
router.put("/:id", marketAuthGaurd.authorise(), validator.multiple([
    { schema: IdDto, source: "params" },
    { schema: ProductUpdateDto, source: "body" }
]), productController.updateProduct);


// Delete Product
router.delete("/:id", marketAuthGaurd.authorise(), validator.single(IdDto, "params"), productController.deleteProduct);

export default router;