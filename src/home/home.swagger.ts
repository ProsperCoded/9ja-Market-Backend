/**
 * @swagger
 * tags:
 *   name: Home
 *   description: Home and general endpoints
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Home endpoint
 *     description: Welcome message for the 9ja Market API
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Welcome to the 9ja Market API"
 *             example:
 *               status: success
 *               message: "Welcome to the 9ja Market API"
 */
