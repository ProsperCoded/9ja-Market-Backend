/**
 * @swagger
 * tags:
 *   name: Advertisements
 *   description: Advertisement management endpoints
 */

/**
 * @swagger
 * /ad/free/{productId}:
 *   post:
 *     summary: Activate free ad
 *     description: Activate a free advertisement for a product (requires merchant authentication)
 *     tags: [Advertisements]
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
 *     responses:
 *       201:
 *         description: Free ad activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Ad'
 *       400:
 *         description: Ad already exists or validation error
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
 */

/**
 * @swagger
 * /ad/initialize/{level}/{productId}:
 *   post:
 *     summary: Initialize ad payment
 *     description: Initialize payment for a premium advertisement (requires merchant authentication)
 *     tags: [Advertisements]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: level
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 3
 *         description: Advertisement level (1-3, higher levels are more prominent)
 *         example: 2
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         paymentUrl:
 *                           type: string
 *                           example: "https://checkout.paystack.com/xxxxxxxxx"
 *                         reference:
 *                           type: string
 *                           example: "TXN_123456789"
 *                         amount:
 *                           type: number
 *                           example: 5000.00
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
 */

/**
 * @swagger
 * /ad/verify/{reference}:
 *   get:
 *     summary: Verify ad payment
 *     description: Verify advertisement payment and activate ad (requires merchant authentication)
 *     tags: [Advertisements]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment reference
 *         example: "TXN_123456789"
 *     responses:
 *       200:
 *         description: Payment verified and ad activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Ad'
 *       400:
 *         description: Payment verification failed
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
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /ad:
 *   get:
 *     summary: Get filtered ads
 *     description: Retrieve active, paid advertisements (filters out expired and unpaid ads)
 *     tags: [Advertisements]
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 3
 *         description: Filter by advertisement level
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [EDUCATION_AND_STATIONERY, REAL_ESTATE_AND_HOUSING, EVENTS_AND_ENTERTAINMENT, TECHNOLOGY_SERVICES, CULTURAL_EXPERIENCES, FOOD_AND_GROCERIES, ELECTRONICS_AND_GADGETS, FASHION_AND_ACCESSORIES, HEALTH_AND_WELLNESS, HOME_AND_LIVING, AUTOMOBILE_NEEDS, TRADITIONAL_CRAFTS, SPORTS_AND_OUTDOOR, KIDS_AND_BABY_PRODUCTS]
 *         description: Filter by product category
 *     responses:
 *       200:
 *         description: Ads retrieved successfully
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
 *                         $ref: '#/components/schemas/Ad'
 *             example:
 *               status: success
 *               message: Ads retrieved successfully
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   level: 2
 *                   paidFor: true
 *                   adViews: 1500
 *                   adClicks: 75
 *                   product:
 *                     name: "iPhone 15 Pro"
 *                     price: 1200.00
 */

/**
 * @swagger
 * /ad/all:
 *   get:
 *     summary: Get all ads
 *     description: Retrieve all advertisements including expired and unpaid ones (admin/debug purpose)
 *     tags: [Advertisements]
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 3
 *         description: Filter by advertisement level
 *       - in: query
 *         name: paidFor
 *         schema:
 *           type: boolean
 *         description: Filter by payment status
 *     responses:
 *       200:
 *         description: All ads retrieved successfully
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
 *                         $ref: '#/components/schemas/Ad'
 */

/**
 * @swagger
 * /ad/{adId}:
 *   get:
 *     summary: Get ad by ID
 *     description: Retrieve a specific advertisement by its ID
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: adId
 *         required: true
 *         schema:
 *           type: string
 *         description: Advertisement ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Ad retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Ad'
 *       404:
 *         description: Ad not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /ad/product/{productId}:
 *   get:
 *     summary: Get ad by product ID
 *     description: Retrieve advertisement for a specific product
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Ad retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Ad'
 *       404:
 *         description: Ad not found for this product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /ad/{adId}/click:
 *   put:
 *     summary: Track ad click
 *     description: Increment click count for an advertisement
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: adId
 *         required: true
 *         schema:
 *           type: string
 *         description: Advertisement ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Ad click tracked successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         adClicks:
 *                           type: integer
 *                           example: 76
 *       404:
 *         description: Ad not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /ad/{adId}/view:
 *   put:
 *     summary: Track ad view
 *     description: Increment view count for an advertisement
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: adId
 *         required: true
 *         schema:
 *           type: string
 *         description: Advertisement ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Ad view tracked successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         adViews:
 *                           type: integer
 *                           example: 1501
 *       404:
 *         description: Ad not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
