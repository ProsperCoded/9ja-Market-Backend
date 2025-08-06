/**
 * @swagger
 * tags:
 *   name: Merchants
 *   description: Merchant profile management endpoints
 */

/**
 * @swagger
 * /merchant/{merchantId}:
 *   get:
 *     summary: Get merchant profile
 *     description: Retrieve merchant profile by ID
 *     tags: [Merchants]
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
 *         description: Merchant profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Merchant'
 *       404:
 *         description: Merchant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update merchant profile
 *     description: Update merchant profile (requires authentication as the same merchant)
 *     tags: [Merchants]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brandName:
 *                 type: string
 *                 example: "Updated Store Name"
 *               displayImage:
 *                 type: string
 *                 example: "https://example.com/new-image.jpg"
 *               merchantCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [EDUCATION_AND_STATIONERY, REAL_ESTATE_AND_HOUSING, EVENTS_AND_ENTERTAINMENT, TECHNOLOGY_SERVICES, CULTURAL_EXPERIENCES, FOOD_AND_GROCERIES, ELECTRONICS_AND_GADGETS, FASHION_AND_ACCESSORIES, HEALTH_AND_WELLNESS, HOME_AND_LIVING, AUTOMOBILE_NEEDS, TRADITIONAL_CRAFTS, SPORTS_AND_OUTDOOR, KIDS_AND_BABY_PRODUCTS]
 *                 example: [ELECTRONICS_AND_GADGETS, FASHION_AND_ACCESSORIES]
 *           example:
 *             brandName: "Tech Store Pro"
 *             merchantCategories: [ELECTRONICS_AND_GADGETS]
 *     responses:
 *       200:
 *         description: Merchant profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Merchant'
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
 *         description: Merchant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete merchant account
 *     description: Delete merchant account (requires authentication as the same merchant)
 *     tags: [Merchants]
 *     security:
 *       - BearerAuth: []
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
 *         description: Merchant account deleted successfully
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
 *         description: Merchant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /merchant/market/{marketId}:
 *   get:
 *     summary: Get merchants by market
 *     description: Retrieve all merchants in a specific market
 *     tags: [Merchants]
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
 *         description: Merchants retrieved successfully
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
 *                         $ref: '#/components/schemas/Merchant'
 *             example:
 *               status: success
 *               message: Merchants retrieved successfully
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   email: "merchant1@example.com"
 *                   brandName: "Tech Store 1"
 *                 - id: "550e8400-e29b-41d4-a716-446655440001"
 *                   email: "merchant2@example.com"
 *                   brandName: "Fashion Store 1"
 *       404:
 *         description: Market not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
