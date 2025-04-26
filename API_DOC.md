# OurCo Backend API Documentation

## Authentication

### Register
- **POST** `/api/auth/register/`
- Register a new user.
- **Body:** `{ "email": str, "password": str, ... }`

### Login (JWT)
- **POST** `/api/auth/login/`
- Returns access/refresh tokens and user info.
- **Body:** `{ "email": str, "password": str }`

### Token Refresh
- **POST** `/api/auth/token/refresh/`
- Refresh JWT access token.
- **Body:** `{ "refresh": str }`

### Logout
- **POST** `/api/auth/logout/`
- Blacklist refresh token.
- **Body:** `{ "refresh": str }`

---

## User Profile

### Get Profile
- **GET** `/api/auth/me/` or `/api/auth/profile/`
- Requires JWT.

### Update Profile
- **PUT/PATCH** `/api/auth/me/` or `/api/auth/profile/`
- Requires JWT.

---

## Password Management

### Change Password
- **POST** `/api/auth/password/change/`
- **Body:** `{ "old_password": str, "new_password": str }`

### Request Password Reset
- **POST** `/api/auth/password/reset/`
- **Body:** `{ "email": str }`

### Confirm Password Reset
- **POST** `/api/auth/password/reset/confirm/`
- **Body:** `{ "token": str, "new_password": str }`

---

## Admin User Management

### List Users
- **GET** `/api/auth/admin/users/`
- Requires admin JWT.

### Create User
- **POST** `/api/auth/admin/users/`
- Requires admin JWT.

### Update User
- **PUT/PATCH** `/api/auth/admin/users/{id}/`
- Requires admin JWT.

### Delete User
- **DELETE** `/api/auth/admin/users/{id}/`
- Requires admin JWT.

### Toggle User Active
- **POST** `/api/auth/admin/users/{id}/toggle_active/`
- Requires admin JWT.

### Change User Role
- **POST** `/api/auth/admin/users/{id}/change_role/`
- **Body:** `{ "role": str }`
- Requires admin JWT.

---

## File Uploads (Google Cloud Storage)

### Get Signed Upload URL
- **POST** `/api/upload/get-upload-url/`
- Requires JWT.
- **Body:** `{ "filename": str, "content_type": str, "folder": str (optional) }`
- **Response:** `{ "url": str }` (Use this URL to upload file directly via HTTP PUT)

---

## Services (Example)

### List Services
- **GET** `/api/services/`

### Create Service
- **POST** `/api/services/`
- Requires admin JWT.

### Update Service
- **PUT/PATCH** `/api/services/{slug}/`
- Requires admin JWT.

### Delete Service
- **DELETE** `/api/services/{slug}/`
- Requires admin JWT.

---

## Other Endpoints
- See `/api/projects/`, `/api/blog/`, etc. for additional features.

---

## Notes
- All endpoints under `/api/auth/` require JWT unless specified.
- Use `Authorization: Bearer <access_token>` header for authenticated requests.
- For file uploads, always request a signed URL first, then upload the file directly to Google Cloud Storage using PUT.

---

© 2025 OurCo Backend API
