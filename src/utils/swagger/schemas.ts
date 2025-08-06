/**
 * @swagger
 * components:
 *   schemas:
 *     # Base Response Schemas
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
 *     # Authentication Schemas
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: customer@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
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
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     CustomerRegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *         - phoneNumbers
 *         - addresses
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: customer@example.com
 *         password:
 *           type: string
 *           minLength: 5
 *           example: password123
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         phoneNumbers:
 *           type: array
 *           items:
 *             type: string
 *           minItems: 2
 *           maxItems: 2
 *           example: ["+2348012345678", "+2347012345678"]
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AddressCreate'
 *
 *     MerchantRegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - brandName
 *         - marketId
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: merchant@example.com
 *         password:
 *           type: string
 *           example: password123
 *         brandName:
 *           type: string
 *           example: "John's Store"
 *         marketId:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         referrerCode:
 *           type: string
 *           example: "REF123"
 *
 *     EmailVerificationRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *
 *     VerifyEmailRequest:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: string
 *           example: "123456"
 *
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - code
 *         - password
 *       properties:
 *         code:
 *           type: string
 *           example: "123456"
 *         password:
 *           type: string
 *           example: newpassword123
 *
 *     # User Schemas
 *     Customer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         email:
 *           type: string
 *           format: email
 *           example: customer@example.com
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         emailVerifiedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         displayImage:
 *           type: string
 *           example: "https://example.com/image.jpg"
 *         role:
 *           type: string
 *           enum: [ADMIN, EDITOR, USER, MARKETER, MERCHANT]
 *           example: USER
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address'
 *         phoneNumbers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PhoneNumber'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Merchant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         email:
 *           type: string
 *           format: email
 *           example: merchant@example.com
 *         brandName:
 *           type: string
 *           example: "John's Store"
 *         emailVerifiedAt:
 *           type: string
 *           format: date-time
 *         displayImage:
 *           type: string
 *         marketId:
 *           type: string
 *         market:
 *           $ref: '#/components/schemas/Market'
 *         merchantCategories:
 *           type: array
 *           items:
 *             type: string
 *             enum: [EDUCATION_AND_STATIONERY, REAL_ESTATE_AND_HOUSING, EVENTS_AND_ENTERTAINMENT, TECHNOLOGY_SERVICES, CULTURAL_EXPERIENCES, FOOD_AND_GROCERIES, ELECTRONICS_AND_GADGETS, FASHION_AND_ACCESSORIES, HEALTH_AND_WELLNESS, HOME_AND_LIVING, AUTOMOBILE_NEEDS, TRADITIONAL_CRAFTS, SPORTS_AND_OUTDOOR, KIDS_AND_BABY_PRODUCTS]
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address'
 *         phoneNumbers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PhoneNumber'
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Marketer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         email:
 *           type: string
 *           format: email
 *           example: marketer@example.com
 *         referrerCode:
 *           type: string
 *           example: "REF123"
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         username:
 *           type: string
 *           example: johndoe
 *         phoneNumber:
 *           type: string
 *           example: "+2348012345678"
 *         accountName:
 *           type: string
 *           example: "John Doe"
 *         accountBank:
 *           type: string
 *           example: "First Bank"
 *         accountNumber:
 *           type: string
 *           example: "1234567890"
 *         BusinessType:
 *           type: string
 *           example: "Individual"
 *         marketingExperience:
 *           type: string
 *           example: "2 years"
 *         IdentityCredentialType:
 *           type: string
 *           example: "NIN"
 *         IdentityCredentialImage:
 *           type: string
 *           example: "https://example.com/image.jpg"
 *         verified:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     # Product Schemas
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         name:
 *           type: string
 *           example: "iPhone 15 Pro"
 *         details:
 *           type: string
 *           example: "Latest iPhone with A17 chip"
 *         description:
 *           type: string
 *           example: "The iPhone 15 Pro is the latest flagship smartphone from Apple..."
 *         price:
 *           type: number
 *           example: 1200.00
 *         prevPrice:
 *           type: number
 *           example: 1300.00
 *         stock:
 *           type: integer
 *           example: 50
 *         category:
 *           type: string
 *           enum: [EDUCATION_AND_STATIONERY, REAL_ESTATE_AND_HOUSING, EVENTS_AND_ENTERTAINMENT, TECHNOLOGY_SERVICES, CULTURAL_EXPERIENCES, FOOD_AND_GROCERIES, ELECTRONICS_AND_GADGETS, FASHION_AND_ACCESSORIES, HEALTH_AND_WELLNESS, HOME_AND_LIVING, AUTOMOBILE_NEEDS, TRADITIONAL_CRAFTS, SPORTS_AND_OUTDOOR, KIDS_AND_BABY_PRODUCTS]
 *           example: ELECTRONICS_AND_GADGETS
 *         displayImage:
 *           $ref: '#/components/schemas/ProductImage'
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductImage'
 *         merchantId:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         merchant:
 *           $ref: '#/components/schemas/Merchant'
 *         clicks:
 *           type: integer
 *           example: 100
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ProductCreate:
 *       type: object
 *       required:
 *         - name
 *         - details
 *         - description
 *         - price
 *         - stock
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           example: "iPhone 15 Pro"
 *         details:
 *           type: string
 *           example: "Latest iPhone with A17 chip"
 *         description:
 *           type: string
 *           example: "The iPhone 15 Pro is the latest flagship smartphone from Apple..."
 *         price:
 *           type: number
 *           example: 1200.00
 *         prevPrice:
 *           type: number
 *           example: 1300.00
 *         stock:
 *           type: integer
 *           example: 50
 *         category:
 *           type: string
 *           enum: [EDUCATION_AND_STATIONERY, REAL_ESTATE_AND_HOUSING, EVENTS_AND_ENTERTAINMENT, TECHNOLOGY_SERVICES, CULTURAL_EXPERIENCES, FOOD_AND_GROCERIES, ELECTRONICS_AND_GADGETS, FASHION_AND_ACCESSORIES, HEALTH_AND_WELLNESS, HOME_AND_LIVING, AUTOMOBILE_NEEDS, TRADITIONAL_CRAFTS, SPORTS_AND_OUTDOOR, KIDS_AND_BABY_PRODUCTS]
 *           example: ELECTRONICS_AND_GADGETS
 *
 *     ProductUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "iPhone 15 Pro Max"
 *         details:
 *           type: string
 *           example: "Updated details"
 *         description:
 *           type: string
 *           example: "Updated description"
 *         price:
 *           type: number
 *           example: 1250.00
 *         prevPrice:
 *           type: number
 *           example: 1350.00
 *         stock:
 *           type: integer
 *           example: 45
 *         category:
 *           type: string
 *           enum: [EDUCATION_AND_STATIONERY, REAL_ESTATE_AND_HOUSING, EVENTS_AND_ENTERTAINMENT, TECHNOLOGY_SERVICES, CULTURAL_EXPERIENCES, FOOD_AND_GROCERIES, ELECTRONICS_AND_GADGETS, FASHION_AND_ACCESSORIES, HEALTH_AND_WELLNESS, HOME_AND_LIVING, AUTOMOBILE_NEEDS, TRADITIONAL_CRAFTS, SPORTS_AND_OUTDOOR, KIDS_AND_BABY_PRODUCTS]
 *           example: ELECTRONICS_AND_GADGETS
 *
 *     ProductImage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         url:
 *           type: string
 *           example: "https://example.com/product-image.jpg"
 *         productId:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     # Market Schemas
 *     Market:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         name:
 *           type: string
 *           example: "Computer Village"
 *         displayImage:
 *           type: string
 *           example: "https://example.com/market-image.jpg"
 *         description:
 *           type: string
 *           example: "Africa's largest ICT market"
 *         address:
 *           type: string
 *           example: "Ikeja, Lagos"
 *         city:
 *           type: string
 *           example: "Lagos"
 *         state:
 *           type: string
 *           example: "Lagos"
 *         isMall:
 *           type: boolean
 *           example: false
 *         merchants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Merchant'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     MarketCreate:
 *       type: object
 *       required:
 *         - name
 *         - address
 *       properties:
 *         name:
 *           type: string
 *           example: "Computer Village"
 *         address:
 *           type: string
 *           example: "Ikeja, Lagos"
 *         description:
 *           type: string
 *           example: "Africa's largest ICT market"
 *         city:
 *           type: string
 *           example: "Lagos"
 *         state:
 *           type: string
 *           example: "Lagos"
 *         isMall:
 *           type: string
 *           enum: ["true", "false"]
 *           example: "false"
 *
 *     # Address and Contact Schemas
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         name:
 *           type: string
 *           example: "Home"
 *         address:
 *           type: string
 *           example: "123 Main Street"
 *         city:
 *           type: string
 *           example: "Lagos"
 *         state:
 *           type: string
 *           example: "Lagos"
 *         country:
 *           type: string
 *           example: "Nigeria"
 *         zipCode:
 *           type: string
 *           example: "100001"
 *         postalCode:
 *           type: string
 *           example: "100001"
 *         isPrimary:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     AddressCreate:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - city
 *         - state
 *         - country
 *       properties:
 *         name:
 *           type: string
 *           example: "Home"
 *         address:
 *           type: string
 *           example: "123 Main Street"
 *         city:
 *           type: string
 *           example: "Lagos"
 *         state:
 *           type: string
 *           example: "Lagos"
 *         country:
 *           type: string
 *           example: "Nigeria"
 *         zipCode:
 *           type: string
 *           example: "100001"
 *         postalCode:
 *           type: string
 *           example: "100001"
 *         isPrimary:
 *           type: boolean
 *           example: true
 *
 *     PhoneNumber:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         number:
 *           type: string
 *           example: "+2348012345678"
 *         isPrimary:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     # Cart Schemas
 *     CartProduct:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         customerId:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         productId:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         quantity:
 *           type: integer
 *           example: 2
 *         totalPrice:
 *           type: number
 *           example: 2400.00
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     AddToCart:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: integer
 *           example: 2
 *
 *     # Rating Schemas
 *     Rating:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         customerId:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         productId:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         comment:
 *           type: string
 *           example: "Great product!"
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     RatingCreate:
 *       type: object
 *       required:
 *         - rating
 *       properties:
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         comment:
 *           type: string
 *           example: "Great product!"
 *
 *     # Ad Schemas
 *     Ad:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         level:
 *           type: integer
 *           example: 1
 *         paidFor:
 *           type: boolean
 *           example: true
 *         productId:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         adViews:
 *           type: integer
 *           example: 1000
 *         adClicks:
 *           type: integer
 *           example: 50
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     # Transaction Schemas
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         merchantId:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         merchant:
 *           $ref: '#/components/schemas/Merchant'
 *         amount:
 *           type: number
 *           example: 100.00
 *         status:
 *           type: string
 *           enum: [SUCCESS, FAILED, INCOMPLETE, INITIALIZED, PENDING]
 *           example: SUCCESS
 *         for:
 *           type: string
 *           enum: [ADVERTISEMENT]
 *           example: ADVERTISEMENT
 *         reference:
 *           type: string
 *           example: "TXN_123456789"
 *         date:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     # Stats Schemas
 *     PlatformStats:
 *       type: object
 *       properties:
 *         totalCustomers:
 *           type: integer
 *           example: 1000
 *         totalMerchants:
 *           type: integer
 *           example: 250
 *         totalMarketers:
 *           type: integer
 *           example: 50
 *
 *     AdRevenue:
 *       type: object
 *       properties:
 *         totalRevenue:
 *           type: number
 *           example: 50000.00
 *         monthlyRevenue:
 *           type: number
 *           example: 5000.00
 *         dailyRevenue:
 *           type: number
 *           example: 200.00
 *
 *     AllStats:
 *       type: object
 *       properties:
 *         platformStats:
 *           $ref: '#/components/schemas/PlatformStats'
 *         adRevenue:
 *           $ref: '#/components/schemas/AdRevenue'
 *         totalProducts:
 *           type: integer
 *           example: 5000
 *         totalAds:
 *           type: integer
 *           example: 200
 *
 *     # Marketer Earnings
 *     MarketerEarnings:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         marketerId:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         merchantId:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         amount:
 *           type: number
 *           example: 100.00
 *         paid:
 *           type: boolean
 *           example: false
 *         AdId:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         marketer:
 *           $ref: '#/components/schemas/Marketer'
 *         merchant:
 *           $ref: '#/components/schemas/Merchant'
 *         Ad:
 *           $ref: '#/components/schemas/Ad'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     # Pagination
 *     PaginationResult:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             type: object
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 *             total:
 *               type: integer
 *               example: 100
 *             totalPages:
 *               type: integer
 *               example: 10
 *             hasNextPage:
 *               type: boolean
 *               example: true
 *             hasPrevPage:
 *               type: boolean
 *               example: false
 */
