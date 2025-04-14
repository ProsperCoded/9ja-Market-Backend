# Marketer Service Documentation

## Overview

The Marketer Service handles all operations related to marketers in the 9ja Market platform. Marketers are users who can refer merchants to the platform and earn commissions from their referred merchants' ad purchases.

## Features

- Marketer Registration and Management
- Earnings Management
- Referral Tracking
- Verification System

## API Endpoints

### Public Endpoints

#### Get Marketer by Referrer Code

```http
GET /referrer/:referrerCode
```

- **Description**: Retrieves marketer information using their referrer code
- **Access**: Public
- **Response**: Marketer details without sensitive information

### Protected Endpoints

#### Create Marketer

```http
POST /
```

- **Description**: Register a new marketer
- **Body Parameters**:
  ```typescript
  {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string;
    accountName: string;
    accountBank: string;
    accountNumber: string;
    BusinessType: string;
    marketingExperience?: string;
    IdentityCredentialType: string;
  }
  ```
- **File Upload**:
  - Field name: "IdentityCredentialImage"
  - Accepts: Image files
- **Response**: Created marketer object

#### Update Marketer

```http
PUT /:marketerId
```

- **Description**: Update marketer information
- **Authentication**: Required
- **Body Parameters**: All fields are optional
  ```typescript
  {
    email?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    phoneNumber?: string;
    accountName?: string;
    accountBank?: string;
    accountNumber?: string;
    BusinessType?: string;
    marketingExperience?: string;
    IdentityCredentialType?: string;
  }
  ```
- **File Upload**: Optional update for IdentityCredentialImage
- **Response**: Updated marketer object

#### Get All Marketers

```http
GET /
```

- **Description**: List all marketers
- **Authentication**: Admin only
- **Response**: Array of marketer objects

#### Get All Marketers with Earnings

```http
GET /earnings
```

- **Description**: List all marketers with their earning summaries
- **Authentication**: Admin only
- **Response**: Array of marketers with earnings data
  ```typescript
  {
    ...marketerInfo,
    earnings: {
      paid: number;
      unpaid: number;
    }
  }
  ```

#### Get Marketer by ID

```http
GET /:marketerId
```

- **Description**: Get detailed marketer information including referred merchants
- **Authentication**: Required
- **Response**: Marketer object with referral information

#### Get Marketer Earnings

```http
GET /:marketerId/earnings
```

- **Description**: Get all earnings for a marketer
- **Authentication**: Required
- **Response**:
  ```typescript
  {
    earnings: Array<{
      amount: number;
      paid: boolean;
      createdAt: Date;
      merchant: MerchantInfo;
      Ad: AdInfo;
    }>;
    totalEarnings: number;
  }
  ```

#### Get Paid Earnings

```http
GET /:marketerId/earnings-paid
```

- **Description**: Get only paid earnings for a marketer
- **Authentication**: Required
- **Response**: Similar to earnings endpoint but only paid transactions

#### Get Unpaid Earnings

```http
GET /:marketerId/earnings-unpaid
```

- **Description**: Get only unpaid earnings for a marketer
- **Authentication**: Required
- **Response**: Similar to earnings endpoint but only unpaid transactions

#### Mark Earnings as Paid

```http
POST /:marketerId/payment-made
```

- **Description**: Mark all unpaid earnings as paid for a marketer
- **Authentication**: Admin only
- **Response**:
  ```typescript
  {
    message: string;
    markedAsPaid: number;
    totalPaid: number;
  }
  ```

#### Verify Marketer

```http
PUT /:marketerId/verify
```

- **Description**: Verify a marketer's account
- **Authentication**: Admin only
- **Response**: Updated marketer object with verified status

#### Delete Marketer

```http
DELETE /:marketerId
```

- **Description**: Delete a marketer account
- **Authentication**: Admin only
- **Response**: Success message

## Integration with Other Services

### Merchant Service Integration

- Marketers can refer merchants using their referrer code
- Merchants can be connected to marketers during or after registration
- Each merchant can only be connected to one marketer
- Connection must happen within 6 months of merchant registration for earnings eligibility

### Ad Service Integration

- Marketers earn 10% (AdPercentagePerReferral) of ad costs from their referred merchants
- Earnings are calculated automatically when ads are paid for
- Only ads from merchants referred within their first 6 months are eligible for earnings

### Customer Service Integration

- If a customer registers as a marketer, their role is automatically updated to MARKETER
- Customers can view their marketer profile and earnings through the customer service

## Authentication and Authorization

- Most endpoints require authentication
- Admin-only endpoints require ADMIN role
- Marketers can only access their own data unless they have ADMIN role
- Verification status affects ability to earn from referrals

## Error Handling

The service returns standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request (e.g., duplicate email/username)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Best Practices

1. Always verify marketer status before referring merchants
2. Use the referrer code for merchant registration
3. Monitor earnings regularly through the earnings endpoints
4. Keep identity credentials up to date
5. Use the provided file upload for identity credential images
