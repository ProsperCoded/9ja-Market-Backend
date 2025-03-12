# Advertisement API Documentation

This document describes the new endpoints available for managing advertisements in the 9ja Market Backend.

## Endpoints

### Get Ads (with optional filters)

```http
GET /api/ads
```

Retrieves advertisements with optional filtering by market and/or merchant.

**Query Parameters**

- `market` (optional): Market ID to filter ads by market
- `merchant` (optional): Merchant ID to filter ads by merchant

**Examples**

- Get all ads: `/api/ads`
- Filter by market: `/api/ads?market=market_id`
- Filter by merchant: `/api/ads?merchant=merchant_id`
- Filter by both: `/api/ads?market=market_id&merchant=merchant_id`

**Response**

```json
{
  "status": "success",
  "message": "Ads fetched successfully",
  "data": [
    {
      "id": "string",
      "level": number,
      "paidFor": boolean,
      "productId": "string",
      "expiresAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "product": {
        // Product details including merchant and market info
      }
    }
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

```json
{
  "status": "error",
  "message": "Error message description",
  "data": null
}
```

Common error scenarios:

- 404: Resource not found
- 500: Internal server error
