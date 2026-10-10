# LostLink — Smart Digital Lost-and-Found Management System

LostLink is a web-based platform designed to help students and campus communities report, discover, and recover lost belongings. It provides a centralized place to publish lost and found item reports and helps users identify potential matches.

## Features

- **Lost and Found Reports:** Submit details about lost or found belongings.
- **Smart Item Matching:** Compare item details and display potential matches with match scores and reasons.
- **Campus Map:** View reported items by location and select locations when submitting reports.
- **Verification Workflow:** Request verification of item ownership before arranging recovery.
- **Private Chat:** Communicate with other users during the recovery process.
- **QR Recovery Tags:** Generate QR codes to help people initiate item recovery without publicly exposing private contact details.
- **Dark and Light Themes:** Switch between themes for a more comfortable experience.

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Leaflet and OpenStreetMap for campus mapping

### Backend
- Java 17
- Spring Boot 3.2.5 (Maven)
- REST APIs
- Docker

### Database
- JPA / Hibernate (Default H2 in-memory or PostgreSQL/MySQL)
- MongoDB Atlas

---

## Project Structure

```text
LostLink/
├── frontend/       # React + Vite application
├── backend/        # Spring Boot application (with Dockerfile)
├── .gitignore      # Root Git ignore definitions
└── README.md
```

---

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18+) and npm
- Java Development Kit (JDK 17)
- Git
- MongoDB Atlas connection string (or local instance)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
.\mvnw.cmd spring-boot:run
```
*(Runs on `http://localhost:8080`)*

---

## 🚀 Render Deployment Instructions

The backend is configured to deploy as a **Docker Web Service** on Render.

### Render Configuration Settings

| Setting | Value |
|---|---|
| **Service Type** | Web Service |
| **Source Code** | Connected GitHub Repository |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Docker` |
| **Dockerfile Name** | `Dockerfile` |

---

### Required Render Environment Variables

Set the following environment variables in the Render Dashboard (**Web Service ➔ Environment ➔ Environment Variables**):

| Environment Variable | Description | Value Example / Where to Obtain |
|---|---|---|
| `PORT` | Web server listening port (Render assigns dynamically) | `10000` (Render defaults automatically) |
| `SPRING_DATA_MONGODB_URI` | Connection URI for MongoDB Atlas | `mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/lostlink` (Obtain from MongoDB Atlas Dashboard ➔ Connect ➔ Drivers) |
| `APP_JWT_SECRET` | 256-bit secret key for JWT token signing | Generate a random 64-character hex string (e.g. `9a2f8c4b1d7e3f6a8c5b2d9e1f4a7c0b3d6e9f2a5c8b1d4e7f0a3c6b9d2e5f8a`) |
| `APP_CORS_ALLOWED_ORIGINS` | Comma-separated allowed frontend origin URLs | `https://your-frontend.vercel.app,http://localhost:5173` (Obtain from Vercel/Netlify frontend URL) |
| `SPRING_DATASOURCE_URL` *(Optional)* | Relational DB URL if using external PostgreSQL/MySQL | `jdbc:mysql://<host>:3306/lostlink_db` (Leave default for in-memory H2) |
| `SPRING_DATASOURCE_USERNAME` *(Optional)* | Relational DB Username | `root` (Leave default if using H2) |
| `SPRING_DATASOURCE_PASSWORD` *(Optional)* | Relational DB Password | `password` (Leave default if using H2) |

---

## 🗄️ Database Setup & Migration

1. **MongoDB Atlas Setup**:
   - Log into [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Create a database named `lostlink`.
   - Add a database user under **Database Access** and grant read/write permissions.
   - Add `0.0.0.0/0` under **Network Access** to allow connection requests from Render's cloud servers.
   - Copy the MongoDB connection URI into `SPRING_DATA_MONGODB_URI` on Render.

2. **Relational Database (JPA/Hibernate)**:
   - By default, Spring Boot uses an embedded H2 database (`jdbc:h2:mem:lostlinkdb`) with `ddl-auto=update`. Schema tables are initialized automatically on app startup.
   - If using a managed MySQL/PostgreSQL instance (e.g. Render PostgreSQL or Aiven), provide `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`.

---

## 🛡️ Security & Git Best Practices (Do Not Push to Git)

The root `.gitignore` file excludes sensitive credentials and build artifacts. **Never commit the following:**

- `.env`, `.env.local`, `.env.*`
- MongoDB Atlas connection strings with credentials
- JWT secret keys (`*.pem`, `*.key`)
- Build folders (`frontend/dist/`, `backend/target/`, `node_modules/`)

---

## 📋 Manual Deployment Steps

1. **GitHub Push**:
   ```bash
   git init
   git add .
   git commit -m "Configure backend for Render Docker deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/LostLink.git
   git push -u origin main
   ```

2. **Render Web Service Creation**:
   - Go to [Render Dashboard](https://dashboard.render.com).
   - Click **New +** ➔ **Web Service**.
   - Connect your GitHub repository `LostLink`.
   - Set **Root Directory** to `backend`.
   - Set **Runtime** to `Docker`.
   - Set **Dockerfile Name** to `Dockerfile`.
   - Add the Environment Variables listed above.
   - Click **Create Web Service**. Render will automatically build the multi-stage Docker image and deploy your Spring Boot API.

---

*LostLink — Helping lost belongings find their way home.*
