/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: Platform statistics and analytics endpoints
 */

/**
 * @swagger
 * /stats/platform:
 *   get:
 *     summary: Get platform statistics
 *     description: Retrieve basic platform statistics including customer, merchant, and marketer counts (requires admin authentication)
 *     tags: [Statistics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Platform statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PlatformStats'
 *             example:
 *               status: success
 *               message: Platform statistics retrieved successfully
 *               data:
 *                 totalCustomers: 1500
 *                 totalMerchants: 350
 *                 totalMarketers: 75
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /stats/revenue:
 *   get:
 *     summary: Get revenue statistics
 *     description: Retrieve advertisement revenue statistics (requires admin authentication)
 *     tags: [Statistics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AdRevenue'
 *             example:
 *               status: success
 *               message: Revenue statistics retrieved successfully
 *               data:
 *                 totalRevenue: 125000.00
 *                 monthlyRevenue: 15000.00
 *                 dailyRevenue: 500.00
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /stats/all:
 *   get:
 *     summary: Get comprehensive statistics
 *     description: Retrieve all platform statistics including users, revenue, products, and ads (requires admin authentication)
 *     tags: [Statistics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AllStats'
 *             example:
 *               status: success
 *               message: All statistics retrieved successfully
 *               data:
 *                 platformStats:
 *                   totalCustomers: 1500
 *                   totalMerchants: 350
 *                   totalMarketers: 75
 *                 adRevenue:
 *                   totalRevenue: 125000.00
 *                   monthlyRevenue: 15000.00
 *                   dailyRevenue: 500.00
 *                 totalProducts: 8500
 *                 totalAds: 425
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /stats/products/count:
 *   get:
 *     summary: Get total products count
 *     description: Retrieve the total number of products on the platform (requires admin authentication)
 *     tags: [Statistics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Product count retrieved successfully
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
 *                         totalProducts:
 *                           type: integer
 *                           example: 8500
 *             example:
 *               status: success
 *               message: Product count retrieved successfully
 *               data:
 *                 totalProducts: 8500
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /stats/ads/count:
 *   get:
 *     summary: Get total ads count
 *     description: Retrieve the total number of advertisements on the platform (requires admin authentication)
 *     tags: [Statistics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Ads count retrieved successfully
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
 *                         totalAds:
 *                           type: integer
 *                           example: 425
 *             example:
 *               status: success
 *               message: Ads count retrieved successfully
 *               data:
 *                 totalAds: 425
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
