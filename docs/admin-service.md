# Admin Service Documentation

## Overview
The admin functionality in 9ja Market platform is implemented through role-based access control. Admins are created as customers with elevated privileges (Role.ADMIN) and have access to platform-wide management features.

## Admin Creation

### Register Admin Account
```http
POST /auth/customer/admin/register
```
**Description**: Creates a new admin account  
**Access**: Requires API Key  
**Request Body**:
```typescript
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
```
**Response**:
```typescript
{
  status: "success",
  message: "Admin registration successful",
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "ADMIN";
    emailVerifiedAt: Date;
    // other customer fields...
  }
}
```
**Note**: Admin accounts are automatically verified upon creation.

## Admin Protected Endpoints

### Statistics Management
All stats endpoints require admin authentication (`Role.ADMIN`).

#### Platform Statistics
```http
GET /stats/platform
```
Returns basic platform statistics.

#### Revenue Statistics
```http
GET /stats/revenue
```
Returns platform revenue data.

#### Complete Statistics
```http
GET /stats/all
```
Returns all platform metrics.

### Market Management
Market administration endpoints require admin authentication.

#### Create Market
```http
POST /market
```
Creates a new market.

#### Update Market
```http
PUT /market/:marketId
```
Updates market information.

#### Delete Market
```http
DELETE /market/:marketId
```
Removes a market.

#### Delete All Markets
```http
DELETE /market
```
Removes all markets (use with caution).

### Marketer Management

#### Get All Marketers
```http
GET /marketer
```
Lists all marketers.

#### Get Marketer Earnings
```http
GET /marketer/earnings
```
Retrieves earnings for all marketers.

#### Verify Marketer
```http
PUT /marketer/:marketerId/verify
```
Verifies a marketer account.

#### Mark Earnings as Paid
```http
POST /marketer/:marketerId/payment-made
```
Marks marketer earnings as paid.

## Authentication and Authorization

### Admin JWT Token
- All admin endpoints require a valid JWT token
- Token must belong to a user with `Role.ADMIN`
- Use the token in Authorization header: `Bearer <token>`

### Request Headers
```typescript
{
  "Authorization": "Bearer <admin_jwt_token>",
  "Content-Type": "application/json"
}
```

### Admin Guards
The platform uses `CustomerAuthGuard` with role checking:
```typescript
customerAuthGuard.authorise({ strict: true, role: Role.ADMIN })
```

## Error Responses

### Common Error Codes
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (non-admin access attempt)
- 404: Resource not found
- 500: Internal server error

### Error Response Format
```typescript
{
  status: "error",
  message: string,
  error?: any
}
```

## Best Practices

1. **Security**
   - Always use HTTPS for admin endpoints
   - Keep API keys secure
   - Regularly rotate admin credentials
   - Use strong passwords

2. **API Usage**
   - Cache platform statistics when possible
   - Implement rate limiting for admin endpoints
   - Log all admin actions for audit
   - Use pagination for large data sets

3. **Admin Account Management**
   - Create dedicated admin accounts
   - Avoid sharing admin credentials
   - Regular security audits
   - Monitor admin activity

## Implementation Example

```typescript
// Admin authentication
async function adminLogin() {
  const response = await fetch('/auth/customer/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'admin@example.com',
      password: 'secure_password'
    })
  });
  return response.json();
}

// Accessing admin protected endpoint
async function getPlatformStats(adminToken: string) {
  const response = await fetch('/stats/all', {
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}
```

## Important Notes

1. **Admin Creation**
   - Admin accounts can only be created using the admin registration endpoint
   - Requires valid API key for security
   - Automatically verified upon creation

2. **Role Management**
   - Admin role cannot be self-assigned
   - Role changes require system-level access
   - Role is enforced at the middleware level

3. **Access Control**
   - All admin endpoints are protected
   - Regular user tokens cannot access admin endpoints
   - Invalid tokens result in 401/403 responses

4. **Data Management**
   - Admins have full CRUD access to platform data
   - Some operations cannot be undone
   - Use caution with delete operations