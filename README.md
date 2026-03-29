# Laravel + React/Inertia Docker Environment

This repository uses a containerized architecture managed via Docker Compose. The environment is split into three distinct configurations—**Development**, **Staging**, and **Production**—to ensure fast local development and immutable, secure production deployments via Dokploy.

## 🛠 Tech Stack
* **Backend:** Laravel 11, PHP 8.3-FPM
* **Frontend:** React 19, Inertia.js, Vite, Tailwind CSS v4, Radix UI
* **Database:** PostgreSQL 18+
* **Server:** Nginx
* **Deployment:** Docker & Dokploy

---

## 📂 Architecture Overview

The Docker configuration is housed entirely within the `dokploy/` directory to keep the project root clean:
* `dokploy/development/`: Mounts local code directly into the container. Optimized for hot-reloading, Vite dev server, and Xdebug. **Note: This is the only environment designed to run locally out-of-the-box.**
* `dokploy/staging/` & `dokploy/production/`: Multi-stage Docker builds. Frontend assets (`npm run build`) and Composer dependencies are baked directly into an immutable image. No dev-tools are installed. These environments rely on the external `dokploy-network` managed by your production server.

---

## 🚀 Getting Started (Local Development)

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```

2. **Set up your environment variables:**
   ```bash
   cp dokploy/development/.env.example dokploy/development/.env
   # Make sure to set your DB credentials and APP_KEY
   ```

3. **Install npm dependencies:**
   *(Required locally to run the shortcut scripts below)*
   ```bash
   npm install
   ```

4. **Boot the development environment:**
   ```bash
   npm run u:dev
   ```
5. **Open the app in a browser**
   <a href="http://localhost:8080" target="_blank">http://localhost:8080</a>

## 🧰 Docker Management Scripts

To make managing the containers painless, this project includes custom NPM scripts. You don't need to type out long `docker compose` commands.

### Environment Toggles (Up / Down)
| Command | Action |
| :--- | :--- |
| `npm run u:dev` | Boots the **Development** environment (`up -d --build`) |
| `npm run d:dev` | Spins down the **Development** environment |
| `npm run u:staging` | Boots the **Staging** environment |
| `npm run d:staging` | Spins down the **Staging** environment |
| `npm run u:prod` | Boots the **Production** environment |
| `npm run d:prod` | Spins down the **Production** environment |

### Container Access (Exec)
Jump directly into the shell of your running containers to run Artisan commands, tinker, or check logs.

| Command | Environment | Container Shell |
| :--- | :--- | :--- |
| `npm run e:dev:app` | Development | PHP/Laravel App |
| `npm run e:dev:nginx`| Development | Nginx |
| `npm run e:staging:app`| Staging | PHP/Laravel App |
| `npm run e:prod:app` | Production | PHP/Laravel App |

---

## ⚠️ Important Gotchas & Troubleshooting

### 1. PostgreSQL 18 Volume Mounting
This project uses PostgreSQL 18+. Starting with v18, Postgres requires the Docker data volume to be mounted to `/var/lib/postgresql`, **not** `/var/lib/postgresql/data`. 
If you ever encounter a database startup error about an "unused mount/volume", it means you have legacy data in your Docker volume. 
**Fix:** Nuke the old volume (`docker volume rm <volume_name>`) and restart the container.

### 2. Wayfinder & Vite Build Process (Production)
The frontend uses `@laravel/vite-plugin-wayfinder`, which requires access to PHP and Laravel's `artisan` during the `npm run build` process. 
In our `Dockerfile.prod`, this is handled by a unified **Builder Stage** (`php:8.3-cli`) that installs both Composer and Node dependencies together before compiling the frontend assets. 

### 3. Production Environment Variables
Do not put real production secrets in `.env.example`. When deploying to Dokploy, provide the real `.env` variables directly in the Dokploy UI. Your container relies on Dokploy injecting these at runtime.

### 4. Local Execution of Staging/Production
Because the `compose-staging.yml` and `compose-prod.yml` files are configured to attach to an external network (`dokploy-network`) managed by Traefik/Dokploy, they will **fail to start locally** by default. If you absolutely need to test the production build locally, you must first create a dummy network on your machine by running `docker network create dokploy-network`.

### 5. Dokploy Auto-Deployment Process
Our server utilizes Dokploy to run a Docker Compose service that actively watches specific compose files within our repository. It is configured to automatically trigger rebuilds and deployments whenever changes are pushed to designated branches (e.g., `main` or `staging`). As such, the complete end-to-end production build and deployment process cannot be fully replicated locally unless you implement the exact same Dokploy system or an equivalent webhook-based CI/CD pipeline on your machine.
