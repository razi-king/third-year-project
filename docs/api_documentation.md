# Smart Vendor App - API Documentation

## Base URL
Backend API Base URL: `http://localhost:8080/api`

## Authentication

All endpoints under `/products`, `/orders`, and `/admin` require a valid JWT token in the `Authorization` header.
Format: `Bearer <token>`

---

## 1. Authentication APIs

### 1.1 Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
      "name": "Jane Customer",
      "email": "jane@example.com",
      "password": "password123",
      "role": "CUSTOMER" // OR VENDOR
  }
  ```
- **Response** (200 OK): `"User registered successfully"`

### 1.2 User Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
      "email": "jane@example.com",
      "password": "password123"
  }
  ```
- **Response** (200 OK):
  ```json
  {
      "token": "eyJhbG...",
      "id": 1,
      "name": "Jane Customer",
      "email": "jane@example.com",
      "role": "CUSTOMER"
  }
  ```

---

## 2. Product APIs (Role: VENDOR / CUSTOMER)

### 2.1 Get All Products
- **URL**: `/products`
- **Method**: `GET`
- **Access**: ANY Auth
- **Response** (200 OK): Page of `ProductDto`

### 2.2 Create Product (Vendor Only)
- **URL**: `/products`
- **Method**: `POST`
- **Access**: `ROLE_VENDOR`
- **Body**:
  ```json
  {
      "name": "Gaming Mouse",
      "description": "RGB Gaming Mouse",
      "price": 49.99,
      "category": "Electronics",
      "stock": 100,
      "imageUrl": "mouse.png"
  }
  ```
- **Response** (201 Created): `ProductDto`

### 2.3 Get Vendor Products
- **URL**: `/vendors/{vendorId}/products`
- **Method**: `GET`
- **Access**: ANY Auth
- **Response** (200 OK): Page of `ProductDto`

---

## 3. Order APIs

### 3.1 Place New Order (Customer)
- **URL**: `/orders`
- **Method**: `POST`
- **Access**: `ROLE_CUSTOMER`
- **Body**:
  ```json
  {
      "vendorId": 1,
      "shippingAddress": "123 Main St",
      "paymentMethod": "Credit Card",
      "items": [
          { "productId": 1, "quantity": 2 },
          { "productId": 3, "quantity": 1 }
      ]
  }
  ```
- **Response** (201 Created): `OrderDto`

### 3.2 Get Vendor Orders (Vendor Only)
- **URL**: `/vendors/{vendorId}/orders`
- **Method**: `GET`
- **Access**: `ROLE_VENDOR` (Must match authenticated user)
- **Response** (200 OK): List of `OrderDto`

### 3.3 Update Order Status (Vendor Only)
- **URL**: `/orders/{orderId}/status?status=SHIPPED`
- **Method**: `PATCH`
- **Access**: `ROLE_VENDOR`
- **Response** (200 OK): `OrderDto`

---

## 4. Admin APIs

### 4.1 Get All Users (Admin Only)
- **URL**: `/admin/users`
- **Method**: `GET`
- **Access**: `ROLE_ADMIN`
- **Response** (200 OK): Page of `UserDto`

### 4.2 Get All Vendors (Admin Only)
- **URL**: `/admin/vendors`
- **Method**: `GET`
- **Access**: `ROLE_ADMIN`
- **Response** (200 OK): Page of `VendorDto`

### 4.3 Update User Role (Admin Only)
- **URL**: `/admin/users/{userId}/role`
- **Method**: `PATCH`
- **Access**: `ROLE_ADMIN`
- **Body**: `{ "role": "VENDOR" }`
- **Response** (200 OK): `UserDto`
