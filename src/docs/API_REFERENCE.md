
# API Reference

This document provides comprehensive details about the available API endpoints, request/response formats, authentication methods, and usage examples.

## Authentication

All API requests require authentication using Bearer tokens.

### Obtaining a Token

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

### Using Authentication

Include the token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Refreshing Tokens

```
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## API Endpoints

### Products API

#### List Products

```
GET /api/products
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Filter by category ID
- `search`: Search term for product name

**Response:**
```json
{
  "data": [
    {
      "id": "prod_123",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "category": "cat_456",
      "inStock": true,
      "imageUrl": "https://example.com/image.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### Get Product

```
GET /api/products/{productId}
```

**Response:**
```json
{
  "id": "prod_123",
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "cat_456",
  "inStock": true,
  "imageUrl": "https://example.com/image.jpg",
  "attributes": {
    "color": "Blue",
    "size": "Medium",
    "weight": "1.5kg"
  },
  "inventory": {
    "quantity": 50,
    "reservedQuantity": 5,
    "availableQuantity": 45
  }
}
```

#### Create Product

```
POST /api/products
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 129.99,
  "category": "cat_456",
  "attributes": {
    "color": "Red",
    "size": "Large"
  },
  "inventory": {
    "quantity": 100
  }
}
```

**Response:** The created product object

#### Update Product

```
PUT /api/products/{productId}
```

**Request Body:** Product fields to update
**Response:** The updated product object

#### Delete Product

```
DELETE /api/products/{productId}
```

**Response:** HTTP 204 No Content

### Orders API

#### List Orders

```
GET /api/orders
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by order status
- `from`: Start date for filtering
- `to`: End date for filtering

**Response:**
```json
{
  "data": [
    {
      "id": "ord_789",
      "customer": {
        "id": "cust_123",
        "name": "John Doe"
      },
      "items": [
        {
          "product": "prod_123",
          "quantity": 2,
          "price": 99.99
        }
      ],
      "total": 199.98,
      "status": "processing",
      "createdAt": "2025-05-01T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

#### Get Order

```
GET /api/orders/{orderId}
```

**Response:** Detailed order object

#### Create Order

```
POST /api/orders
```

**Request Body:**
```json
{
  "customerId": "cust_123",
  "items": [
    {
      "productId": "prod_123",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "US"
  },
  "paymentMethod": "card_456"
}
```

**Response:** The created order object

#### Update Order Status

```
PATCH /api/orders/{orderId}/status
```

**Request Body:**
```json
{
  "status": "shipped",
  "notes": "Shipped via Express"
}
```

**Response:** The updated order object

### Customers API

#### List Customers

```
GET /api/customers
```

**Query Parameters:** Pagination and filtering options
**Response:** List of customers with pagination

#### Get Customer

```
GET /api/customers/{customerId}
```

**Response:** Detailed customer profile

#### Create Customer

```
POST /api/customers
```

**Request Body:** Customer information
**Response:** The created customer object

#### Update Customer

```
PUT /api/customers/{customerId}
```

**Request Body:** Customer fields to update
**Response:** The updated customer object

## Rate Limiting

API requests are subject to rate limiting:
- 100 requests per minute for authenticated requests
- 10 requests per minute for unauthenticated requests

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Time until limit resets (in seconds)

## Error Handling

API errors follow a consistent format:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "Invalid request parameters",
    "details": {
      "field": "email",
      "issue": "must be a valid email address"
    }
  }
}
```

### Common Error Codes

- `unauthorized`: Authentication required
- `forbidden`: Insufficient permissions
- `not_found`: Resource not found
- `invalid_request`: Invalid request parameters
- `rate_limited`: Too many requests
- `server_error`: Internal server error

## Webhooks

The API can send webhooks for important events:

### Setting Up Webhooks

```
POST /api/webhooks
```

**Request Body:**
```json
{
  "url": "https://your-server.com/webhook",
  "events": ["order.created", "order.updated"],
  "secret": "your_webhook_signing_secret"
}
```

### Webhook Events

- `order.created`: When a new order is created
- `order.updated`: When an order status changes
- `product.lowStock`: When product inventory is low
- `customer.created`: When a new customer is registered

### Webhook Payload

```json
{
  "event": "order.created",
  "timestamp": "2025-05-01T12:00:00Z",
  "data": {
    "id": "ord_789",
    "customer": "cust_123",
    "total": 199.98,
    "status": "processing"
  }
}
```

## API Versioning

The API version is specified in the URL path:

```
https://api.example.com/v1/products
```

When a new version is released, the previous version remains available for a deprecation period of at least 6 months.
