# TEJOVA — Environment Variables Reference

This document lists the required environment variable **NAMES** across the Backend, Public Frontend, and Admin Dashboard applications.

> **IMPORTANT SECURITY DIRECTIVE**: Never commit actual secret values, API keys, or database passwords to version control. Set these environment variables in your hosting provider's management console (e.g. Render Dashboard) or local `.env` files.

---

## 1. Backend Service Environment Variables (`Backend/.env`)

| Variable Name | Purpose & Description | Required in Production |
| :--- | :--- | :---: |
| `PORT` | Local HTTP server port number (default: `5000` locally, dynamically set by Render in production) | Yes |
| `NODE_ENV` | Application environment state (`development` or `production`) | Yes |
| `MONGODB_URI` | MongoDB Atlas database connection connection string | Yes |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens | Yes |
| `JWT_EXPIRES_IN` | Token expiration duration string (e.g. `30d` or `24h`) | Yes |
| `CLIENT_URL` | Allowed CORS origin URL for the Public Frontend application | Yes |
| `ADMIN_URL` | Allowed CORS origin URL for the Admin Dashboard application | Yes |
| `FRONTEND_URL` | Additional fallback origin URL for Public Frontend | Yes |
| `ADMIN_FRONTEND_URL` | Additional fallback origin URL for Admin Dashboard | Yes |
| `ADMIN_EMAIL` | Initial administrator seed account email address | Optional |
| `ADMIN_PASSWORD` | Initial administrator seed account password | Optional |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud account name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API access key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret signature key | Yes |

---

## 2. Public Frontend Environment Variables (`TEJOVA/.env`)

| Variable Name | Purpose & Description | Required in Production |
| :--- | :--- | :---: |
| `VITE_API_URL` | Public backend REST API base URL (e.g., `https://new-folder-2-backend.onrender.com/api`) | Yes |

---

## 3. Admin Dashboard Environment Variables (`TEJOVA-Admin-Dashboard/.env`)

| Variable Name | Purpose & Description | Required in Production |
| :--- | :--- | :---: |
| `VITE_API_URL` | Public backend REST API base URL (e.g., `https://new-folder-2-backend.onrender.com/api`) | Yes |
