/**
 * @swagger
 * tags:
 *   name: Marketers
 *   description: Marketer management and earnings endpoints
 */

/**
 * @swagger
 * /marketer/referrer/{referrerCode}:
 *   get:
 *     summary: Get marketer by referrer code
 *     description: Retrieve marketer information using their referrer code (public endpoint)
 *     tags: [Marketers]
 *     parameters:
 *       - in: path
 *         name: referrerCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Marketer referrer code
 *         example: "REF123"
 *     responses:
 *       200:
 *         description: Marketer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Marketer'
 *       404:
 *         description: Marketer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /marketer:
 *   get:
 *     summary: Get all marketers
 *     description: Retrieve list of all marketers (requires admin authentication)
 *     tags: [Marketers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Marketers retrieved successfully
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
 *                         $ref: '#/components/schemas/Marketer'
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
 *   post:
 *     summary: Create marketer
 *     description: Register a new marketer
 *     tags: [Marketers]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "marketer@example.com"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348012345678"
 *               accountName:
 *                 type: string
 *                 example: "John Doe"
 *               accountBank:
 *                 type: string
 *                 example: "First Bank"
 *               accountNumber:
 *                 type: string
 *                 example: "1234567890"
 *               BusinessType:
 *                 type: string
 *                 example: "Individual"
 *               marketingExperience:
 *                 type: string
 *                 example: "2 years"
 *               IdentityCredentialType:
 *                 type: string
 *                 example: "NIN"
 *               IdentityCredentialImage:
 *                 type: string
 *                 format: binary
 *                 description: Identity credential image file
 *     responses:
 *       201:
 *         description: Marketer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Marketer'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /marketer/earnings:
 *   get:
 *     summary: Get all marketers with earnings
 *     description: Retrieve list of all marketers with their earnings information (requires admin authentication)
 *     tags: [Marketers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Marketers with earnings retrieved successfully
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
 *                           marketer:
 *                             $ref: '#/components/schemas/Marketer'
 *                           totalEarnings:
 *                             type: number
 *                             example: 15000.00
 *                           paidEarnings:
 *                             type: number
 *                             example: 10000.00
 *                           unpaidEarnings:
 *                             type: number
 *                             example: 5000.00
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
 * /marketer/{marketerId}:
 *   get:
 *     summary: Get marketer by ID
 *     description: Retrieve marketer profile by ID (requires authentication)
 *     tags: [Marketers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: marketerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Marketer ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Marketer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Marketer'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Marketer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update marketer
 *     description: Update marketer profile (requires authentication)
 *     tags: [Marketers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: marketerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Marketer ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Smith"
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348012345678"
 *               accountName:
 *                 type: string
 *                 example: "John Smith"
 *               accountBank:
 *                 type: string
 *                 example: "GTBank"
 *               accountNumber:
 *                 type: string
 *                 example: "0123456789"
 *               BusinessType:
 *                 type: string
 *                 example: "Company"
 *               marketingExperience:
 *                 type: string
 *                 example: "5 years"
 *               IdentityCredentialType:
 *                 type: string
 *                 example: "CAC"
 *               IdentityCredentialImage:
 *                 type: string
 *                 format: binary
 *                 description: Updated identity credential image file
 *     responses:
 *       200:
 *         description: Marketer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Marketer'
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
 *         description: Marketer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete marketer
 *     description: Delete marketer account (requires admin authentication)
 *     tags: [Marketers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: marketerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Marketer ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Marketer deleted successfully
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
 *         description: Marketer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /marketer/{marketerId}/earnings:
 *   get:
 *     summary: Get marketer earnings
 *     description: Retrieve all earnings for a specific marketer (requires authentication)
 *     tags: [Marketers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: marketerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Marketer ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Marketer earnings retrieved successfully
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
 *                         $ref: '#/components/schemas/MarketerEarnings'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Marketer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /marketer/{marketerId}/earnings-paid:
 *   get:
 *     summary: Get paid earnings
 *     description: Retrieve paid earnings for a specific marketer (requires authentication)
 *     tags: [Marketers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: marketerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Marketer ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Paid earnings retrieved successfully
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
 *                         $ref: '#/components/schemas/MarketerEarnings'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Marketer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /marketer/{marketerId}/earnings-unpaid:
 *   get:
 *     summary: Get unpaid earnings
 *     description: Retrieve unpaid earnings for a specific marketer (requires authentication)
 *     tags: [Marketers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: marketerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Marketer ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Unpaid earnings retrieved successfully
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
 *                         $ref: '#/components/schemas/MarketerEarnings'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Marketer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /marketer/{marketerId}/payment-made:
 *   post:
 *     summary: Mark earnings as paid
 *     description: Mark marketer's earnings as paid (requires admin authentication)
 *     tags: [Marketers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: marketerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Marketer ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Earnings marked as paid successfully
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
 *         description: Marketer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /marketer/{marketerId}/verify:
 *   put:
 *     summary: Verify marketer
 *     description: Verify marketer account (requires admin authentication)
 *     tags: [Marketers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: marketerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Marketer ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Marketer verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Marketer'
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
 *         description: Marketer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
