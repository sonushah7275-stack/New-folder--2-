# TEJOVA — Production Deployment Architecture

## 1. Executive Deployment Summary

The TEJOVA platform is hosted in production on **Render** across three decoupled web services connected to MongoDB Atlas and Cloudinary Cloud Media Services.

Live Production Release Commit: **`665004ee`**  
Target Git Branch: **`main`**

---

## 2. Production Service Endpoints

| Component | Production Service Type | Deployed URL |
| :--- | :--- | :--- |
| **Public Frontend** | Render Static Web Service | [https://new-folder-2-tejova.onrender.com/](https://new-folder-2-tejova.onrender.com/) |
| **Admin Dashboard** | Render Static Web Service | [https://tejova-admin-dashboard.onrender.com/](https://tejova-admin-dashboard.onrender.com/) |
| **Backend REST API**| Render Node.js Web Service | [https://new-folder-2-backend.onrender.com/](https://new-folder-2-backend.onrender.com/) |

---

## 3. Deployment Configuration Details

### 3.1 Backend Service (`Backend/`)
- **Environment**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Health Check Route**: `/health` (Returns HTTP 200 `{ success: true, message: "TEJOVA API is running" }`)
- **Auto-Deploy**: Enabled on Git push to `main` branch.

### 3.2 Public Frontend Service (`TEJOVA/`)
- **Environment**: Static Site / Vite Build
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **SPA Rewrite Route**: `/*` -> `/index.html` (Redirect single-page application routes to index)
- **Auto-Deploy**: Enabled on Git push to `main` branch.

### 3.3 Admin Dashboard Service (`TEJOVA-Admin-Dashboard/`)
- **Environment**: Static Site / Vite Build
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **SPA Rewrite Route**: `/*` -> `/index.html`
- **Auto-Deploy**: Enabled on Git push to `main` branch.

---

## 4. Release & Build Verification Commands

When deploying locally or verifying continuous integration:

```bash
# Backend syntax check
cd Backend && node --check server.js

# Admin Dashboard production build check
cd TEJOVA-Admin-Dashboard && npm run build

# Public Frontend production build check
cd TEJOVA && npm run build
```

All commands must exit with Code `0`.
