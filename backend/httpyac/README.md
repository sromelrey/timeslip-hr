# httpYac API Testing

This folder contains HTTP request files for testing the API using the [httpYac](https://httpyac.github.io/) VS Code extension.

## Setup

1. Install the httpYac extension in VS Code
2. Open any `.http` file
3. Click on "Send Request" above any request block

## Files

- `auth.http` - Authentication endpoints (login, refresh, logout, profile)
- `products.http` - Product CRUD operations

## JWT Authentication

This API uses JWT (JSON Web Token) authentication:

1. **Login** - Send credentials to `/auth/login` to receive tokens
2. **Access Token** - Short-lived token (15 min) sent in `Authorization: Bearer` header
3. **Refresh Token** - Long-lived token (7 days) used to get new access tokens
4. **Protected Routes** - All product endpoints require valid access token

## Variables

The requests use httpYac variables to store and reuse tokens:
- `{{login.response.body.accessToken}}` - Access token from login response
- `{{login.response.body.refreshToken}}` - Refresh token from login response

## Request Order

1. Run "Login" request first to get tokens
2. Other requests will automatically use the stored tokens
