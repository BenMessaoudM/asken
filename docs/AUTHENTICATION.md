# Authentication and Authorization

## Session Model

Login creates a short-lived JWT access token and a rotating refresh token. Both are stored in HttpOnly, SameSite=Lax cookies. Production cookies are always Secure. Access tokens expire after 15 minutes by default; refresh sessions expire after seven days and are persisted as SHA-256 token hashes.

Refresh rotates the token hash. Logout revokes the refresh session and clears both cookies. Changing a password revokes every refresh session for that user. Disabled accounts cannot resolve an authenticated principal.

## Password Policy

Passwords are hashed with bcrypt using a configurable cost of 10–14, default 12. New passwords require 12–128 characters with uppercase, lowercase, number, and special character. Passwords are never returned by APIs or stored in audit metadata.

## RBAC

Users reference roles; roles reference permissions. Protected backend routes first authenticate the user and then evaluate explicit permission keys. Current administrative permissions are:

- `users.read`
- `users.write`
- `roles.read`
- `roles.write`
- `audit.read`

The admin client guards routes and hides write controls, but backend permission middleware remains authoritative.

## Audit Events

Successful and failed login, refresh, logout, password changes, user creation/update, role creation, and role-permission changes create immutable audit records with actor, target, timestamp, IP, user agent, action, and non-secret metadata.
