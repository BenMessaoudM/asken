# API Contract

This document describes the HTTP API exposed by the backend.

## Authentication

All protected endpoints require a JSON Web Token (JWT) in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are created during the login flow and verified on each request using the `jsonwebtoken` library and the `JWT_SECRET` environment variable. A missing or invalid token results in a `401 Unauthorized` response.

### Login Flow

`POST /auth/login`

Obtains a JWT for subsequent requests.

- **Request Body** – validated with Zod:

```ts
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
```

Example:

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

- **Response**:

```json
{
  "token": "<jwt>"
}
```

Clients should store the token and include it in the `Authorization` header for protected routes.

## Endpoints

### `POST /message`

Sends a message that will be forwarded by email.

- **Auth**: Required.
- **Request Body** – validated with Zod:

```ts
const messageSchema = z.object({
  message: z.string()
});
```

Example:

```json
{
  "message": "Hello there!"
}
```

- **Responses**:
  - `200 OK` – `{ "status": "sent" }`
  - `400 Bad Request` – Zod validation errors formatted using `error.flatten()`
  - `401 Unauthorized` – `No token provided` or `Invalid token`
  - `500 Internal Server Error` – `{ "error": "email error", "details": "<reason>" }`

### Error Format

Validation errors follow the structure produced by [`zod`](https://zod.dev) `error.flatten()`:

```json
{
  "fieldErrors": { "message": ["Required"] },
  "formErrors": []
}
```

