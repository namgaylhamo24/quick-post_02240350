
# Quick-Post Content Aggregator - Structured Architecture

A full-stack web application with separate frontend and backend services. The frontend is built with Next.js and the backend is a standalone Express.js API server.

## 📁 Project Structure

\`\`\`
quick-post-aggregator/
├── frontend/                 # Next.js React application
│   ├── app/                 # Next.js 14 App Router
│   ├── components/          # Reusable React components
│   ├── lib/                 # Frontend utilities and configurations
│   └── package.json         # Frontend dependencies
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic services
│   │   ├── lib/             # Backend utilities
│   │   └── types/           # TypeScript type definitions
│   ├── prisma/              # Database schema and migrations
│   └── package.json         # Backend dependencies
└── package.json             # Root workspace configuration
\`\`\`

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (local or cloud)

### 1. Clone and Install
\`\`\`bash
git clone https://github.com/yourusername/quick-post-aggregator.git
cd quick-post-aggregator

# Install root dependencies
npm install

# Install all workspace dependencies
npm run install:all
\`\`\`

### 2. Environment Setup

**Backend Environment** (\`backend/.env.local\`):
\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/quickpost"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
FRONTEND_URL="http://localhost:3000"
\`\`\`

**Frontend Environment** (\`frontend/.env.local\`):
\`\`\`env
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BACKEND_URL="http://localhost:3001"
\`\`\`

### 3. Database Setup
\`\`\`bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
\`\`\`

### 4. Start Development Servers
\`\`\`bash
# From root directory - starts both frontend and backend
npm run dev

# Or start individually:
npm run dev:frontend  # Frontend on :3000
npm run dev:backend   # Backend on :3001
\`\`\`

## 🏗️ Architecture Overview

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **Authentication**: NextAuth.js with JWT strategy
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React hooks + NextAuth session
- **API Communication**: Fetch API to backend endpoints

### Backend (Express.js)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with middleware protection
- **API Design**: RESTful endpoints with proper HTTP status codes
- **Validation**: Zod schemas for request validation

### Database Schema
- **Users**: Authentication and profile data
- **Bookmarks**: User-specific saved articles
- **Sessions/Tokens**: NextAuth.js and custom JWT management

## 🔐 Authentication Flow

### Magic Link Process:
1. **Frontend**: User enters email → calls backend \`/api/auth/magic-link\`
2. **Backend**: Generates JWT token → stores in database → logs link to console
3. **User**: Clicks magic link → frontend calls \`/api/auth/verify\`
4. **Backend**: Validates token → returns user data + access token
5. **Frontend**: Stores session → enables authenticated features

### API Security:
- All bookmark endpoints require \`Authorization: Bearer <token>\` header
- JWT tokens expire after 7 days
- Magic link tokens expire after 15 minutes

## 📊 API Endpoints

### Public Endpoints
- \`GET /api/articles\` - Proxy to Dev.to API with caching

### Protected Endpoints (require authentication)
- \`GET /api/bookmarks\` - Get user's bookmarks
- \`POST /api/bookmarks\` - Create new bookmark
- \`DELETE /api/bookmarks/:articleId\` - Delete bookmark

### Authentication Endpoints
- \`POST /api/auth/magic-link\` - Send magic link email
- \`POST /api/auth/verify\` - Verify magic link token

## 🎯 Key Features

### Frontend Features:
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Feedback**: Toast notifications for all user actions
- **Optimistic UI**: Immediate state updates before API confirmation
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: Graceful error boundaries and user feedback

### Backend Features:
- **Input Validation**: Zod schemas for all API endpoints
- **Error Handling**: Centralized error middleware
- **Security**: Helmet.js, CORS, JWT authentication
- **Database Relations**: Proper foreign keys and cascade deletes
- **API Caching**: Cache headers for article endpoints

## 🔧 Development Tools

### Frontend:
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built accessible components

### Backend:
- **TypeScript**: Strongly typed API development
- **Prisma**: Type-safe database access
- **Nodemon**: Hot reload during development
- **Zod**: Runtime type validation

## 📈 Architectural Decisions & Trade-offs

### Separation of Concerns
**Why Separate Frontend/Backend?**
- **Scalability**: Independent deployment and scaling
- **Team Collaboration**: Frontend and backend teams can work independently
- **Technology Flexibility**: Can swap out either layer without affecting the other
- **Clear Boundaries**: Explicit API contracts between layers

**Trade-offs**:
- **Complexity**: More configuration and deployment steps
- **Development Overhead**: Need to run multiple servers
- **Network Latency**: Additional HTTP calls vs. server-side rendering

### Authentication Strategy
**JWT vs. Database Sessions**:
- **Frontend**: Uses NextAuth.js for session management
- **Backend**: Uses JWT tokens for stateless authentication
- **Hybrid Approach**: Combines benefits of both systems

### Database Design
**Prisma ORM Benefits**:
- **Type Safety**: Auto-generated TypeScript types
- **Migration Management**: Version-controlled schema changes
- **Query Builder**: Intuitive database queries
- **Relationship Management**: Automatic foreign key handling

### API Design Patterns
**RESTful Architecture**:
- **Resource-based URLs**: Clear endpoint naming
- **HTTP Status Codes**: Proper error and success responses
- **Request/Response Validation**: Zod schemas ensure data integrity
- **Middleware Pattern**: Reusable authentication and error handling

## 🚀 Deployment Considerations

### Frontend Deployment (Vercel/Netlify):
- Static site generation for public pages
- Environment variables for API endpoints
- Automatic deployments from Git

### Backend Deployment (Railway/Heroku):
- Docker containerization
- Database migrations in CI/CD
- Environment-based configuration

### Database (Supabase/PlanetScale):
- Managed PostgreSQL service
- Automatic backups and scaling
- Connection pooling for performance

## 🧪 AI Usage Log

### Project Structure Design
- **Tool**: ChatGPT
- **Prompt**: "Design a folder structure for a full-stack app with separate frontend (Next.js) and backend (Express.js) services"
- **Usage**: Generated the initial workspace structure and package.json configurations

### Backend API Architecture
- **Tool**: GitHub Copilot
- **Usage**: Auto-completion for Express.js route handlers and middleware patterns
- **Manual Refinement**: Added custom authentication logic and error handling

### Database Schema Migration
- **Tool**: ChatGPT
- **Prompt**: "Convert NextAuth.js Prisma schema to work with standalone Express.js backend"
- **Usage**: Adapted the schema for JWT-based authentication instead of database sessions

### Frontend API Integration
- **Tool**: GitHub Copilot
- **Usage**: Generated fetch calls and error handling for backend API integration
- **Manual Addition**: Added proper TypeScript types and loading states

### Authentication Flow Implementation
- **Tool**: ChatGPT
- **Prompt**: "Implement JWT-based magic link authentication for Express.js backend"
- **Usage**: Generated the token creation, verification, and middleware logic

This structured approach provides clear separation of concerns, making the codebase more maintainable and suitable for team collaboration while demonstrating full-stack development best practices.
\`\`\`

