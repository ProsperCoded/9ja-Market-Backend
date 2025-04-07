/**
 * @swagger
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [success, error]
 *         message:
 *           type: string
 *         data:
 *           type: object
 *     
 *     Success:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *     
 *     Error:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             status:
 *               type: string
 *               example: error
 *             data:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 reason:
 *                   type: string
 *                 errorString:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *     
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *     
 *     LoginResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Success'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *     
 *     Customer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         emailVerifiedAt:
 *           type: string
 *           format: date-time
 *         displayImage:
 *           type: string
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address'
 *         phoneNumbers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PhoneNumber'
 *     
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         country:
 *           type: string
 *         zipCode:
 *           type: string
 *         postalCode:
 *           type: string
 *         isPrimary:
 *           type: boolean
 *     
 *     PhoneNumber:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         number:
 *           type: string
 *         isPrimary:
 *           type: boolean
 */ 