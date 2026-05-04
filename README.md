# Taskify - Team Task Management Web Application

Taskify is a modern, full-stack collaborative application built to manage team projects, assign tasks, and track progress seamlessly.

## Features

- **User Authentication:** Secure JWT-based signup and login.
- **Project Management:** Create projects and add team members (Admins can manage members).
- **Task Management:** Admins can create tasks, set priority, due dates, and assign them. Members can update the status of tasks assigned to them.
- **Role-Based Access Control:** Project Creators are Admins, added users are Members or Admins.
- **Dynamic Dashboard:** Overview of all projects, active tasks, and overdue items.
- **Modern UI:** Built with Vanilla CSS, featuring a responsive glassmorphism design system.

## Technology Stack

- **Framework:** Next.js (App Router)
- **Database:** PostgreSQL (using SQLite for local dev, Postgres on Railway)
- **ORM:** Prisma
- **Styling:** Vanilla CSS

## Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Database Setup:**
   The project uses SQLite locally by default.
   ```bash
   npx prisma db push
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Railway (Mandatory Steps)

Deploying this Next.js app to Railway is straightforward. Railway detects Next.js out of the box.

1. **Push to GitHub:**
   Commit all files and push this repository to your GitHub account.

2. **Create a Railway Project:**
   - Go to [Railway.app](https://railway.app/).
   - Click "New Project" -> "Deploy from GitHub repo" and select your repository.

3. **Add PostgreSQL Database (Recommended):**
   - In your Railway project, click "New" -> "Database" -> "Add PostgreSQL".
   - This will provision a cloud database for your app.

4. **Configure Environment Variables:**
   - Go to your Next.js service settings in Railway -> **Variables**.
   - Add `JWT_SECRET` (generate a random secure string).
   - Add `DATABASE_URL`. Railway automatically provides this from your Postgres database if you click "Reference Variable".
   - *Note:* Since you changed to Postgres for production, you need to update `prisma/schema.prisma` from `provider = "sqlite"` to `provider = "postgresql"` and push to Github before deploying, OR you can keep it SQLite on Railway, but you MUST add a Volume in Railway settings so the `.db` file isn't deleted on every redeploy.

5. **Deploy:**
   - Railway will automatically run `npm run build` and `npm start`.
   - Your application will be live at the generated Railway domain.

## Recording the Demo Video

As requested in the assignment, please record a 2-5 minute demo video explaining:
1. The project structure and stack.
2. Demonstrating Signup, Login, and creating a Project.
3. Adding a member to the project.
4. Creating a task and showing the dashboard.
