import { Router } from "express";
import { WinstonLogger } from "../utils/logger/winston.logger";
import { ProductRepository } from "../repositories/product.repository";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { Validator } from "../utils/middlewares/validator.middleware";
import { IdDto } from "../dtos/id.dto";
import { ProductUpdateDto } from "./dtos/product-update.dto";

const logger = new WinstonLogger("ProductService");
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository, logger);
const productController = new ProductController(productService);

const validator = new Validator("Product");

const router = Router();


// Get Product by Id
router.get("/:id", validator.single(IdDto, "params"), productController.getProductById);


// Update Product
router.put("/:id", validator.multiple([
    { schema: IdDto, source: "params" },
    { schema: ProductUpdateDto, source: "body" }
]), productController.updateProduct);


// Delete Product
router.delete("/:id", validator.single(IdDto, "params"), productController.deleteProduct);

export default router;