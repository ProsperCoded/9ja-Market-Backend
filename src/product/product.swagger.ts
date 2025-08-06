/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products with pagination
 *     description: Retrieve paginated list of products with optional category filter
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [EDUCATION_AND_STATIONERY, REAL_ESTATE_AND_HOUSING, EVENTS_AND_ENTERTAINMENT, TECHNOLOGY_SERVICES, CULTURAL_EXPERIENCES, FOOD_AND_GROCERIES, ELECTRONICS_AND_GADGETS, FASHION_AND_ACCESSORIES, HEALTH_AND_WELLNESS, HOME_AND_LIVING, AUTOMOBILE_NEEDS, TRADITIONAL_CRAFTS, SPORTS_AND_OUTDOOR, KIDS_AND_BABY_PRODUCTS]
 *         description: Filter by product category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PaginationResult'
 *             example:
 *               status: success
 *               message: Products retrieved successfully
 *               data:
 *                 data:
 *                   - id: "550e8400-e29b-41d4-a716-446655440000"
 *                     name: "iPhone 15 Pro"
 *                     price: 1200.00
 *                     category: ELECTRONICS_AND_GADGETS
 *                 pagination:
 *                   page: 1
 *                   limit: 10
 *                   total: 100
 *                   totalPages: 10
 *   post:
 *     summary: Create a new product
 *     description: Create a new product (requires merchant authentication)
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "iPhone 15 Pro"
 *               details:
 *                 type: string
 *                 example: "Latest iPhone with A17 chip"
 *               description:
 *                 type: string
 *                 example: "The iPhone 15 Pro is the latest flagship smartphone from Apple..."
 *               price:
 *                 type: number
 *                 example: 1200.00
 *               prevPrice:
 *                 type: number
 *                 example: 1300.00
 *               stock:
 *                 type: integer
 *                 example: 50
 *               category:
 *                 type: string
 *                 enum: [EDUCATION_AND_STATIONERY, REAL_ESTATE_AND_HOUSING, EVENTS_AND_ENTERTAINMENT, TECHNOLOGY_SERVICES, CULTURAL_EXPERIENCES, FOOD_AND_GROCERIES, ELECTRONICS_AND_GADGETS, FASHION_AND_ACCESSORIES, HEALTH_AND_WELLNESS, HOME_AND_LIVING, AUTOMOBILE_NEEDS, TRADITIONAL_CRAFTS, SPORTS_AND_OUTDOOR, KIDS_AND_BABY_PRODUCTS]
 *                 example: ELECTRONICS_AND_GADGETS
 *               productImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product images (up to 10 files)
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a specific product by its ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update product
 *     description: Update an existing product (requires merchant authentication)
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdate'
 *           example:
 *             name: "iPhone 15 Pro Max"
 *             price: 1250.00
 *             stock: 45
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete product
 *     description: Delete a product (requires merchant authentication)
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /product/merchant/{merchantId}:
 *   get:
 *     summary: Get products by merchant ID
 *     description: Retrieve all products belonging to a specific merchant
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *       404:
 *         description: Merchant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /product/market/{marketId}:
 *   get:
 *     summary: Get products by market ID
 *     description: Retrieve all products from merchants in a specific market
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: marketId
 *         required: true
 *         schema:
 *           type: string
 *         description: Market ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *       404:
 *         description: Market not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /product/{productId}/images:
 *   post:
 *     summary: Add product images
 *     description: Add images to an existing product (requires merchant authentication)
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product images to add (up to 10 files)
 *     responses:
 *       200:
 *         description: Images added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /product/{productId}/images/{imageId}:
 *   delete:
 *     summary: Remove product image
 *     description: Remove a specific image from a product (requires merchant authentication)
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Image ID
 *         example: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       200:
 *         description: Image removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product or image not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /product/{productId}/images/{imageId}/display:
 *   put:
 *     summary: Set display image
 *     description: Set a specific image as the product's display image (requires merchant authentication)
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Image ID
 *         example: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       200:
 *         description: Display image set successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product or image not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
