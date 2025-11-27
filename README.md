# Portfolio Website Documentation

## Overview

This project is a professional portfolio website for a consulting firm. It consists of a React frontend and a pure PHP backend with MySQL.

## Structure

*   `/frontend`: React Application (Vite).
*   `/backend`: Pure PHP API.

## Database Setup

1.  Create a MySQL database (e.g., `portfolio_db`).
2.  Import `backend/database.sql` into your database.
    *   This will create tables: `admin`, `clients`, `projects`, `project_images`.
    *   It seeds default clients and an admin user.
    *   **Default Admin Credentials**:
        *   Username: `admin`
        *   Password: `password123`

## Backend Deployment (Hosting Biasa/Shared Hosting)

1.  Upload the contents of the `/backend` folder to your `public_html` or a subfolder (e.g., `public_html/api`).
2.  **Configuration**:
    *   Edit `/backend/config/db.php` or create a `.env` file in the root of your backend directory with your database credentials:
        ```
        DB_HOST=localhost
        DB_NAME=your_db_name
        DB_USER=your_db_user
        DB_PASS=your_db_password
        ```
3.  **Permissions**:
    *   Ensure the `uploads/` folder is writable (chmod 755 or 777 depending on your host).
4.  **CORS**:
    *   The `index.php` is configured to allow `*` (all origins). For production security, change `Access-Control-Allow-Origin: *` in `index.php` to your specific frontend domain (e.g., `https://your-vercel-app.vercel.app`).
5.  **Routing**:
    *   The `index.php` handles routing. If you are on Apache, ensure `.htaccess` redirects requests to `index.php`.
    *   **Sample `.htaccess`** (if needed for pretty URLs, though the current React app points to `index.php` logic directly or assumes the server handles it. Since we use `http://host/backend/projects`, the folder structure usually works on shared hosting without rewrite if you access `domain.com/api/projects`. If you want clean URLs like `domain.com/api/projects` instead of `domain.com/api/index.php/projects`, use this `.htaccess` in the backend folder):
        ```apache
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^(.*)$ index.php [QSA,L]
        ```

## Frontend Deployment (Vercel)

1.  **Configuration**:
    *   Open `frontend/src/api.js`.
    *   Change `API_URL` to point to your live backend domain (e.g., `https://yourdomain.com/api`).
2.  **Deploy**:
    *   Push the `frontend` folder to a GitHub repository.
    *   Import the project into Vercel.
    *   Vercel should automatically detect Vite.
    *   Build command: `npm run build`.
    *   Output directory: `dist`.
3.  **React Router**:
    *   Add a `vercel.json` in the `frontend` root to handle SPA routing:
        ```json
        {
          "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
        }
        ```

## Admin Usage Guide

1.  Go to `/admin/login`.
2.  Login with `admin` / `password123`.
3.  **Dashboard**: View list of projects.
4.  **Add Project**:
    *   Fill in Title, Description, Date.
    *   Select Client from the dynamic dropdown.
    *   Select multiple images for documentation.
5.  **Edit Project**:
    *   Update details.
    *   Remove existing images by clicking 'X'.
    *   Add new images.

## Features

*   **Clients**: Managed in database (table `clients`).
*   **Auth**: Token-based authentication (stored in `admin` table).
*   **Security**: PDO Prepared Statements, Password Hashing (Bcrypt).
*   **Frontend**: Pure CSS (Navy + Gold theme), Responsive, React Router.
