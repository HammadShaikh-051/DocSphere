# DocSphere

> A modern collaborative workspace for managing documents, folders, files, and teams.

DocSphere is a full-stack document management and collaboration platform that allows users to create workspaces, organize documents, collaborate with members, track activity, and manage document versions.

---

## ✨ Features

- 🔐 **Local & Google OAuth authentication** — Secure authentication using JWT and Google OAuth2.
- 🏢 **Multiple workspaces** — Create and manage distinct workspaces for different teams or projects.
- 📄 **Document & folder management** — Hierarchical document organization with folder nesting.
- ✍️ **Rich document editor** — Modern TipTap-powered editor for focused, distraction-free writing.
- 💬 **Document comments** — In-line discussions and feedback directly inside documents.
- 🕒 **Activity tracking** — Comprehensive activity timeline across all accessible workspaces.
- 📚 **Version history** — Snapshot, restore, and compare document revisions effortlessly.
- 📎 **File attachments** — Upload and manage document assets backed by Cloudinary.
- 🔍 **Search** — Fast search across workspace documents and resources.
- 🗑️ **Trash & restore** — Safely delete and recover items before permanent deletion.
- 👥 **Workspace members & invitations** — Invite team members via tokenized email invitations.
- 🌙 **Light & dark themes** — Clean, polished themes designed for day and night productivity.
- 📱 **Responsive UI** — Seamless user experience across mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React
- **Build Tool:** Vite
- **Language:** JavaScript
- **Routing:** React Router
- **Data Management:** React Query (TanStack Query) & Zustand
- **Editor:** TipTap
- **Icons:** Lucide React

### Backend
- **Language:** Java
- **Framework:** Spring Boot
- **Security:** Spring Security, JWT, Google OAuth2
- **Persistence:** Spring Data JPA / Hibernate
- **Email:** Brevo API

### Database & Cloud Services
- **Database:** PostgreSQL (Neon Serverless PostgreSQL)
- **Media Storage:** Cloudinary
- **Email Service:** Brevo

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon

---

## 🏗️ Architecture

```text
React + Vite (Frontend)
        │
        │ REST API (JSON / JWT)
        ▼
   Spring Boot (Backend)
        │
        ├──► PostgreSQL (Neon DB)
        ├──► Cloudinary (File Attachments)
        └──► Brevo (Email Delivery)
```

---

## 📂 Project Structure

```text
DocSphere/
├── backend/            # Spring Boot backend application
├── frontend/           # React + Vite frontend application
├── .gitignore          # Git ignore configuration
└── README.md           # Project documentation
```

---

## 🚀 Run Locally

### 1. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

Configure your environment variables in `.env` using the provided `.env.example` file.

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend server will run on:
```text
http://localhost:8080
```

---

### 2. Frontend Setup

Navigate to the `frontend` directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend application will run on:
```text
http://localhost:5173
```

> [!IMPORTANT]
> Create the required `.env` files using the provided `.env.example` files.  
> **Never commit real credentials or secrets.**

---

### 3. Run with Docker (Full Stack)

You can run the entire DocSphere stack (Frontend, Backend, and PostgreSQL) locally with Docker Compose.

#### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

#### Start Containers
From the repository root:

```bash
docker compose up --build
```

#### Stop Containers
To stop all running services:

```bash
docker compose down
```

To stop and also remove the local PostgreSQL data volume:

```bash
docker compose down -v
```

#### Local URLs
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8080](http://localhost:8080) (Health: [http://localhost:8080/health](http://localhost:8080/health))
- **PostgreSQL:** `localhost:5432`

> [!NOTE]
> - **Database Scope:** The Docker PostgreSQL container is dedicated to **local development and testing only**. The production deployment continues to use Neon Serverless PostgreSQL.
> - **Data Persistence:** Local database records persist across restarts in a named Docker volume (`docsphere_postgres_data`).
> - **Environment Variables:** The default setup starts automatically with safe local development defaults. To customize ports or test external third-party services (Google OAuth, Cloudinary, Brevo) locally, copy `.env.docker.example` to `.env` and fill in your values. Never commit real secrets.

---

## 🚀 Future Enhancements

Planned improvements for DocSphere include:

- ⚡ **Real-time Collaboration** — Add Spring WebSocket support for live document collaboration and real-time updates.
- 📥 **Document Export** — Download documents as Word (`.docx`) or PDF files.
- 📤 **Word Import** — Import existing Word documents directly into DocSphere.
- 🔔 **Real-time Notifications** — Notify users about comments, invitations, document changes, and workspace activity.
- 🔗 **Document Sharing** — Share documents through secure links with configurable access permissions.
- 👥 **Advanced Permissions** — Introduce granular workspace and document-level roles and permissions.
- 📱 **Progressive Web App (PWA)** — Improve the mobile experience with installable and offline-capable functionality.

---

## 🌐 Live

- **Website:** [https://docsphere.me](https://docsphere.me)

---

## 👨‍💻 Author

**Hammad Shaikh**  
*B.E. Artificial Intelligence & Data Science*  
Thadomal Shahani Engineering College, Mumbai  

[GitHub](https://github.com/HammadShaikh-051) • [LinkedIn](https://www.linkedin.com/in/hammad-shaikh047/)
