/**
 * @swagger
 * tags:
 *   name: Markets
 *   description: Market management endpoints
 */

/**
 * @swagger
 * /market:
 *   get:
 *     summary: Get all markets
 *     description: Retrieve list of all markets
 *     tags: [Markets]
 *     responses:
 *       200:
 *         description: Markets retrieved successfully
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
 *                         $ref: '#/components/schemas/Market'
 *             example:
 *               status: success
 *               message: Markets retrieved successfully
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "Computer Village"
 *                   address: "Ikeja, Lagos"
 *                   isMall: false
 *   post:
 *     summary: Create a new market
 *     description: Create a new market
 *     tags: [Markets]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Computer Village"
 *               address:
 *                 type: string
 *                 example: "Ikeja, Lagos"
 *               description:
 *                 type: string
 *                 example: "Africa's largest ICT market"
 *               city:
 *                 type: string
 *                 example: "Lagos"
 *               state:
 *                 type: string
 *                 example: "Lagos"
 *               isMall:
 *                 type: string
 *                 enum: ["true", "false"]
 *                 example: "false"
 *               displayImage:
 *                 type: string
 *                 format: binary
 *                 description: Market display image
 *     responses:
 *       201:
 *         description: Market created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Market'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /market/names:
 *   get:
 *     summary: Get market names
 *     description: Retrieve list of market names for dropdown/selection purposes
 *     tags: [Markets]
 *     responses:
 *       200:
 *         description: Market names retrieved successfully
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
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *             example:
 *               status: success
 *               message: Market names retrieved successfully
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "Computer Village"
 *                 - id: "550e8400-e29b-41d4-a716-446655440001"
 *                   name: "Alaba Market"
 */

/**
 * @swagger
 * /market/malls:
 *   get:
 *     summary: Get all malls
 *     description: Retrieve list of all markets that are categorized as malls
 *     tags: [Markets]
 *     responses:
 *       200:
 *         description: Malls retrieved successfully
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
 *                         $ref: '#/components/schemas/Market'
 *             example:
 *               status: success
 *               message: Malls retrieved successfully
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "Shoprite Mall"
 *                   address: "Victoria Island, Lagos"
 *                   isMall: true
 */

/**
 * @swagger
 * /market/{marketId}:
 *   get:
 *     summary: Get market by ID
 *     description: Retrieve a specific market by its ID
 *     tags: [Markets]
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
 *         description: Market retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Market'
 *       404:
 *         description: Market not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update market
 *     description: Update an existing market (requires admin authentication)
 *     tags: [Markets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: marketId
 *         required: true
 *         schema:
 *           type: string
 *         description: Market ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Computer Village Updated"
 *               address:
 *                 type: string
 *                 example: "Ikeja, Lagos State"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               city:
 *                 type: string
 *                 example: "Lagos"
 *               state:
 *                 type: string
 *                 example: "Lagos"
 *               isMall:
 *                 type: string
 *                 enum: ["true", "false"]
 *                 example: "false"
 *               displayImage:
 *                 type: string
 *                 format: binary
 *                 description: Updated market display image
 *     responses:
 *       200:
 *         description: Market updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Market'
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
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Market not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete market
 *     description: Delete a specific market (requires admin authentication)
 *     tags: [Markets]
 *     security:
 *       - BearerAuth: []
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
 *         description: Market deleted successfully
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
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Market not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /market:
 *   delete:
 *     summary: Delete all markets
 *     description: Delete all markets (requires admin authentication) - Use with extreme caution
 *     tags: [Markets]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All markets deleted successfully
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
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
