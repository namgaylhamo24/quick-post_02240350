# Quick-Post Content Aggregator

The Quick-Post Content Aggregator is a full-stack web application designed to help users discover, read, and bookmark articles from Dev.to. It features a robust backend API built with Express.js and Prisma, and a dynamic frontend powered by Next.js, providing a seamless experience for content consumption and management. Users can browse articles, sign in via a magic link, and save their favorite posts to a personalized bookmark list.

## 📁 Project Structure

This project adopts a monorepo structure, separating the frontend and backend into distinct services for improved scalability, maintainability, and team collaboration.

```
quick-post-aggregator/
├── frontend/                 # Next.js React application
│   ├── app/                 # Next.js 14 App Router for pages and API routes
│   ├── components/          # Reusable React components (e.g., ArticleCard, Header)
│   ├── lib/                 # Frontend utilities and configurations (e.g., NextAuth options)
│   └── package.json         # Frontend-specific dependencies
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── routes/          # API route handlers (articles, bookmarks, auth)
│   │   ├── middleware/      # Express middleware (e.g., authentication, error handling)
│   │   ├── services/        # Business logic services (e.g., email sending)
│   │   ├── lib/             # Backend utilities (e.g., Prisma client)
│   │   └── types/           # TypeScript type definitions
│   ├── prisma/              # Database schema and migrations
│   └── package.json         # Backend-specific dependencies
└── package.json             # Root workspace configuration and shared scripts
```

## 🚀 How to Run Locally

Follow these steps to get the Quick-Post Content Aggregator running on your local machine.

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (local or cloud, e.g., Supabase)
- Git

### 1. Clone the Repository
First, clone the project from GitHub:
```bash
git clone https://github.com/namgaylhamo24/quick-post_02240350.git
cd quick-post_02240350
```

### 2. Install Dependencies
Install the root dependencies and then the dependencies for both the frontend and backend workspaces:
```bash
npm install
npm run install:all
```

### 3. Environment Setup
Create `.env.local` files in both the `frontend/` and `backend/` directories by copying their respective `.env.example` files.

**`backend/.env.local`:**
This file contains your database connection string and JWT secret for the backend API.
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"
PORT=3001
FRONTEND_URL="http://localhost:3000"
EMAIL_SERVER_HOST="localhost"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="user"
EMAIL_SERVER_PASSWORD="password"
EMAIL_FROM="noreply@quickpost.dev"
```
*   **`DATABASE_URL`**: Replace with your Supabase PostgreSQL connection string.
*   **`JWT_SECRET`**: Generate a strong, random key (e.g., using `openssl rand -base64 32` in your terminal).

**`frontend/.env.local`:**
This file contains NextAuth.js secrets and the URL for your backend API.
```env
NEXTAUTH_SECRET="your-nextauth-secret-key-different-from-jwt-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BACKEND_URL="http://localhost:3001"
EMAIL_SERVER_HOST="localhost"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="user"
EMAIL_SERVER_PASSWORD="password"
EMAIL_FROM="noreply@quickpost.dev"
```
*   **`NEXTAUTH_SECRET`**: Generate another strong, random key (different from `JWT_SECRET`).
*   **`NEXT_PUBLIC_BACKEND_URL`**: Ensure this matches the `PORT` you set in `backend/.env.local`.

### 4. Database Setup
Navigate to the `backend` directory to set up your database schema using Prisma.
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name "init"
```
This will generate the Prisma client and apply the necessary migrations to create your database tables.

### 5. Seed Database (Optional)
To populate your database with sample users and bookmarks for testing, run the seed script:
```bash
npm run db:seed
```

### 6. Start Development Servers
From the **root directory** of the project, run the combined development script to start both the frontend and backend servers concurrently:
```bash
npm run dev
```
*   The frontend will run on `http://localhost:3000`.
*   The backend API will run on `http://localhost:3001`.

## 📊 Database Schema (ERD)

The application's data model is designed to support user authentication and bookmark management. Below is a conceptual Entity-Relationship Diagram (ERD) illustrating the main tables and their relationships:

![ERD for Quick-Post](https://www.plantuml.com/plantuml/png/bP3BQiCm38Rl-nLq0000)

**Brief Explanation of Tables:**
*   **`User`**: Stores user information, including email, name, and verification status. This is the central entity for authentication and linking bookmarks.
*   **`Account`**: Used by NextAuth.js to link users to their authentication providers (e.g., email, Google, GitHub).
*   **`Session`**: Manages user sessions for NextAuth.js.
*   **`VerificationToken`**: Stores tokens used for magic link authentication.
*   **`Bookmark`**: Stores articles saved by users. Each bookmark is linked to a `User` via `userId` and uniquely identified by a combination of `userId` and `articleId` (from Dev.to). It includes details like title, URL, tags, and author.

## 🏗️ Architectural Decisions & Trade-offs

This project's architecture was designed with several key considerations in mind, balancing performance, scalability, security, and developer experience.

### Authentication
*   **Choice**: Magic Link authentication via NextAuth.js on the frontend and a custom JWT-based authentication on the backend.
*   **Why Magic Link?**: Magic links offer a passwordless, user-friendly authentication experience. It reduces friction for new users and eliminates the need for password management (and associated security risks like weak passwords or breaches). For this content aggregator, a simple sign-in method is ideal.
*   **Security Considerations**:
    *   **Token Expiration**: Both magic link tokens (15 minutes) and JWT access tokens (7 days) have limited lifespans to reduce the window of opportunity for token compromise.
    *   **JWT Secret**: The `JWT_SECRET` on the backend is critical and must be kept secure and unique for production environments.
    *   **Email Security**: Relies on the security of the user's email account. If an email account is compromised, the magic link can be intercepted. In a production environment, a robust email service with rate limiting and spam prevention would be crucial.
    *   **CSRF Protection**: NextAuth.js handles CSRF protection for its routes. For custom backend routes, Express.js middleware like `csurf` would be added for additional protection if forms are involved.

### Database & ORM
*   **Choice**: PostgreSQL as the database, managed with Prisma ORM.
*   **Why Prisma?**:
    *   **Type Safety**: Prisma generates a type-safe client, providing excellent developer experience with autocompletion and compile-time error checking for database queries.
    *   **Migrations**: Simplifies database schema management and version control with its migration system.
    *   **Readability**: Prisma's API for queries is highly readable and intuitive.
    *   **Performance**: Optimized queries and connection pooling capabilities.
*   **Limitations/Trade-offs of Schema Design**:
    *   **Denormalization**: The `Bookmark` table stores some redundant information (e.g., `author`, `coverImage`, `tags`) directly from the Dev.to API. This denormalization improves read performance for displaying bookmarks (fewer joins needed) but means if the original Dev.to article details change, the bookmarked version won't automatically update. For this application's scope, this trade-off is acceptable.
    *   **`articleId` as String**: The `articleId` from Dev.to is stored as a `String` to accommodate potential future variations in external API IDs, even if currently they appear numeric. This provides flexibility.

### Data Fetching
*   **Home Page (SSR/Static)**: The main article grid (`/`) fetches articles from the backend API, which in turn proxies requests to Dev.to. This data is fetched on the server side (or during build time if using static generation with `revalidate`), allowing for faster initial page loads and better SEO. The `revalidate: 300` option in the `app/api/articles/route.ts` ensures the data is cached for 5 minutes, reducing calls to the external Dev.to API.
*   **Bookmarks Page (CSR)**: The bookmarks list (`/bookmarks`) uses Client-Side Rendering (CSR). This is because bookmarks are user-specific and require authentication. Fetching on the client side after the user session is established ensures that only the authenticated user's bookmarks are displayed. It also allows for dynamic updates (e.g., after deleting a bookmark) without a full page reload.

## 🧪 AI Usage Log

Transparency in development is key. Here's how AI tools assisted in building this project:

*   **Project Structure Design**:
    *   **Tool**: ChatGPT
    *   **Prompt**: "Design a folder structure for a full-stack app with separate frontend (Next.js) and backend (Express.js) services, including common directories for API routes, components, middleware, and database schema."
    *   **Usage**: Generated the initial monorepo structure and suggested the logical separation of concerns for `frontend/` and `backend/` directories, including sub-directories like `src/routes`, `src/middleware`, etc.

*   **Prisma Schema for NextAuth.js**:
    *   **Tool**: ChatGPT
    *   **Prompt**: "Give me the Prisma schema models required for the NextAuth.js Prisma adapter, including User, Account, Session, and VerificationToken, and also add a custom Bookmark model with a many-to-one relationship to User."
    *   **Usage**: Provided the foundational `prisma/schema.prisma` content, which was then adapted for the specific `Bookmark` model and `@@map` directives for table naming.

*   **Express.js API Route Boilerplate**:
    *   **Tool**: GitHub Copilot
    *   **Usage**: Auto-completed common Express.js route patterns, including `router.get`, `router.post`, and basic error handling structures within `src/routes/articles.ts` and `src/routes/bookmarks.ts`. It also assisted in setting up `zod` schema validation.

*   **JWT Authentication Middleware**:
    *   **Tool**: ChatGPT
    *   **Prompt**: "Write an Express.js middleware in TypeScript to verify a JWT token from the Authorization header, decode it, and attach the user object (fetched from Prisma) to the request object."
    *   **Usage**: Generated the initial `src/middleware/auth.ts` logic, which was then refined to integrate with the Prisma client and handle specific error cases like expired or invalid tokens.

*   **Frontend API Integration (Bookmark Logic)**:
    *   **Tool**: GitHub Copilot
    *   **Usage**: Assisted in writing the `handleBookmark` and `handleDelete` functions in `components/article-card.tsx` and `components/bookmarks-list.tsx`, including `fetch` API calls, state management (`useState`, `setIsBookmarking`), and `sonner` toast notifications for user feedback.


\`\`\`

