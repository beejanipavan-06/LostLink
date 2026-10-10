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
- Java
- Spring Boot
- REST APIs

### Database
- MongoDB Atlas

## Project Structure

The exact folder structure may vary depending on the existing project.

```text
LostLink/
├── frontend/       # React + Vite application
├── backend/        # Spring Boot application
└── README.md
```

## Getting Started

### Prerequisites
- Node.js and npm
- Java Development Kit (JDK)
- Git
- A MongoDB Atlas account

### Frontend Setup

Open a terminal in the frontend directory and run:

```bash
npm install
npm run dev
```

### Backend Setup

The backend build instructions depend on whether the project uses Maven or Gradle. Follow the instructions after identifying the backend build configuration.

### Database Configuration

Configure the MongoDB Atlas connection and other required environment variables on the backend. Do not commit database credentials, passwords, tokens, or `.env` files to GitHub.

## 🛡️ Security & Git Best Practices (Do Not Push to Git)

The project includes a root `.gitignore` file that automatically excludes sensitive files, local environment variables, build outputs, and heavy dependencies. **Never commit or push the following items to GitHub:**

1. **Environment & Secrets:**
   - `.env`, `.env.local`, `.env.*.local`
   - MongoDB connection URIs containing usernames, passwords, or secret access tokens
   - JWT secret keys or API private keys (`*.pem`, `*.key`, `*.p12`)
2. **Build Outputs & Compilation Artifacts:**
   - `frontend/dist/`, `frontend/build/`
   - `backend/target/`
   - Compiled Java binaries (`*.class`, `*.jar`, `*.war`)
3. **Heavy Dependency Folders:**
   - `node_modules/` (installed automatically via `npm install`)
   - Local Maven installation binaries (`backend/apache-maven-*/`)
4. **IDE & Local System Files:**
   - Visual Studio Code (`.vscode/`), IntelliJ IDEA (`.idea/`, `*.iml`), Eclipse (`.classpath`, `.project`)
   - OS generated files (`.DS_Store`, `Thumbs.db`, `desktop.ini`)
5. **Log Files:**
   - `*.log`, `npm-debug.log*`, `yarn-error.log*`

## Deployment Plan

- **Source control:** Git and GitHub
- **Frontend hosting:** Vercel
- **Backend hosting:** Render
- **Database:** MongoDB Atlas

## Project Goal

LostLink aims to make campus lost-and-found management more accessible, organized, and secure through smart matching, location-based discovery, and an ownership verification process.

---

*LostLink — Helping lost belongings find their way home.*
