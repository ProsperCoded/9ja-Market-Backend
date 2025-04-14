# Merchant Service Documentation

## Overview

The Merchant Service handles all operations related to merchants on the 9ja Market platform. Merchants are users who can register their businesses, manage products, and interact with other platform features such as ads and referrals.

## Features

- Merchant Registration and Authentication
- Merchant Profile Management
- Product Management
- Market Integration
- Referral System

## API Endpoints

### Public Endpoints

#### Register Merchant

```http
POST /auth/merchant/signup
```

- **Description**: Registers a new merchant account
- **Body Parameters**:
  ```typescript
  {
    email: string;
    password: string;
    brandName: string;
    phoneNumbers: string[]; // Must contain exactly 2 elements
    addresses: AddressCreateDto[];
    marketName: string;
    referrerCode?: string;
    referrerUsername?: string;
  }
  ```
- **Response**:
  ```typescript
  {
    status: "success",
    message: "Registration successful",
    data: Merchant;
  }
  ```

#### Login Merchant

```http
POST /auth/merchant/login
```

- **Description**: Authenticates a merchant and returns access and refresh tokens
- **Body Parameters**:
  ```typescript
  {
    email: string;
    password: string;
  }
  ```
- **Response**:
  ```typescript
  {
    status: "success",
    message: "Login successful",
    data: {
      accessToken: string;
      refreshToken: string;
    };
  }
  ```

### Protected Endpoints

#### Get Merchant by ID

```http
GET /merchant/:merchantId
```

- **Description**: Retrieves merchant details by ID
- **Authentication**: Required
- **Response**:
  ```typescript
  {
    status: "success",
    message: "Merchant retrieved successfully",
    data: Merchant;
  }
  ```

#### Update Merchant

```http
PUT /merchant/:merchantId
```

- **Description**: Updates merchant details
- **Authentication**: Required
- **Body Parameters**:
  ```typescript
  {
    email?: string;
    brandName?: string;
    phoneNumbers?: string[];
    addresses?: AddressUpdateDto[];
    marketName?: string;
  }
  ```
- **Response**:
  ```typescript
  {
    status: "success",
    message: "Merchant updated successfully",
    data: Merchant;
  }
  ```

#### Delete Merchant

```http
DELETE /merchant/:merchantId
```

- **Description**: Deletes a merchant account
- **Authentication**: Required
- **Response**:
  ```typescript
  {
    status: "success",
    message: "Merchant deleted successfully",
  }
  ```

#### Connect Merchant to Marketer

```http
POST /merchant/:merchantId/referrer
```

- **Description**: Connects a merchant to a marketer using a referrer code or username
- **Authentication**: Required
- **Body Parameters**:
  ```typescript
  {
    referrerCode?: string;
    referrerUsername?: string;
  }
  ```
- **Response**:
  ```typescript
  {
    status: "success",
    message: "Merchant connected to marketer successfully",
    data: Merchant;
  }
  ```

## Integration with Other Services

### Product Service

- Merchants can manage their products through the Product Service.
- Endpoints include creating, updating, and deleting products.

### Market Service

- Merchants are associated with markets.
- Market names must be valid and pre-existing during registration.

### Ad Service

- Merchants can create and manage ads for their products.
- Ads are linked to merchant accounts.

### Referral System

- Merchants can be referred by marketers using referrer codes or usernames.
- Referrals are validated during registration or later connection.

## Authentication and Authorization

- Most endpoints require authentication using JWT tokens.
- Use the `Authorization` header with the format: `Bearer <token>`.
- Role-based access control is enforced for sensitive operations.

## Error Handling

The service returns standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request (e.g., invalid input)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses follow this format:

```typescript
{
  status: "error",
  message: string;
  error?: any;
}
```

## Best Practices

1. **Validation**: Ensure all required fields are provided during registration and updates.
2. **Security**: Use strong passwords and secure tokens.
3. **Data Integrity**: Validate market names and referrer codes before submission.
4. **Error Handling**: Handle errors gracefully and provide meaningful messages to users.

## Common Use Cases

1. **Merchant Registration**

```typescript
async function registerMerchant(data) {
  const response = await fetch("/auth/merchant/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

2. **Merchant Login**

```typescript
async function loginMerchant(credentials) {
  const response = await fetch("/auth/merchant/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
}
```

3. **Update Merchant Details**

```typescript
async function updateMerchant(merchantId, data, token) {
  const response = await fetch(`/merchant/${merchantId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
```
