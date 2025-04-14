# Stats Service Documentation

## Overview

The Stats Service provides comprehensive platform analytics and metrics for the 9ja Market platform. It aggregates data from various services to provide insights into platform usage, revenue, and growth metrics.

## Features

- Platform Statistics
- Revenue Analytics
- Product Metrics
- Advertisement Analytics
- User Statistics

## API Endpoints

All endpoints require admin authentication (`Role.ADMIN`).

### Get All Platform Stats

```http
GET /stats/all
```

**Description**: Retrieves all platform statistics including user counts and revenue metrics  
**Authentication**: Admin only  
**Response**:

```typescript
{
  status: "success",
  message: "Stats fetched successfully",
  data: {
    totalCustomers: number,
    totalMerchants: number,
    totalProducts: number,
    totalAds: number,
    totalMarketers: number,
    revenue: {
      monthRevenue: number,
      yearRevenue: number,
      totalRevenue: number
    }
  }
}
```

### Get Basic Platform Stats

```http
GET /stats/platform
```

**Description**: Retrieves basic platform statistics (user counts only)  
**Authentication**: Admin only  
**Response**:

```typescript
{
  status: "success",
  message: "Stats fetched successfully",
  data: {
    totalCustomers: number,
    totalMerchants: number,
    totalProducts: number,
    totalAds: number,
    totalMarketers: number
  }
}
```

### Get Revenue Stats

```http
GET /stats/revenue
```

**Description**: Retrieves detailed revenue statistics from ad sales  
**Authentication**: Admin only  
**Response**:

```typescript
{
  status: "success",
  message: "Revenue fetched successfully",
  data: {
    monthRevenue: number,    // Revenue for current month
    yearRevenue: number,     // Revenue for current year
    totalRevenue: number     // All-time revenue
  }
}
```

### Get Total Products Count

```http
GET /stats/products/count
```

**Description**: Retrieves total number of products on the platform  
**Authentication**: Admin only  
**Response**:

```typescript
{
  status: "success",
  message: "Stats fetched successfully",
  data: {
    totalProducts: number
  }
}
```

### Get Total Ads Count

```http
GET /stats/ads/count
```

**Description**: Retrieves total number of advertisements  
**Authentication**: Admin only  
**Response**:

```typescript
{
  status: "success",
  message: "Stats fetched successfully",
  data: {
    totalAds: number
  }
}
```

## Integration Details

### Authentication

- All endpoints require a valid JWT token
- User must have ADMIN role
- Use the CustomerAuthGuard middleware for authorization

### Time Zones

- All revenue calculations use Africa/Lagos timezone
- Date ranges are calculated as follows:
  - Month: First day of current month to current date
  - Year: First day of current year to current date

### Revenue Calculations

- Only considers successful transactions (`PaymentStatus.SUCCESS`)
- Aggregates revenue from ad payments
- Provides breakdowns by month, year, and all-time

## Best Practices

1. **Caching**

   - Consider caching responses for short durations (e.g., 5 minutes)
   - Implement conditional requests using ETags

2. **Error Handling**

   - Handle 401 Unauthorized responses
   - Handle 403 Forbidden responses for non-admin users
   - Implement retry logic for 5xx responses

3. **Performance**
   - Use the /stats/all endpoint for dashboard displays
   - Use specific endpoints for single metric updates
   - Implement polling with appropriate intervals (e.g., 1-5 minutes)

## Common Use Cases

1. **Dashboard Display**

```typescript
// Fetch all stats for dashboard
async function getDashboardStats() {
  const response = await fetch("/stats/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}
```

2. **Revenue Monitoring**

```typescript
// Fetch revenue stats
async function getRevenueMetrics() {
  const response = await fetch("/stats/revenue", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}
```

## Error Handling

The service returns standard HTTP status codes:

- 200: Success
- 401: Unauthorized (invalid or missing token)
- 403: Forbidden (non-admin user)
- 500: Internal Server Error

Error responses follow the format:

```typescript
{
  status: "error",
  message: string,
  error?: any
}
```
